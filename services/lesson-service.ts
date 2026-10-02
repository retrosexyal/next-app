import mongoose from "mongoose";
import Lesson from "@/models/lesson-model";
import GroupStudent from "@/models/group-student-model";
import Subscription from "@/models/subscription-model";
import Attendance from "@/models/attendance-model";
import { canRetireSubscription, consumeSubscriptionLesson } from "@/services/subscription-policy";

// Дата урока хранится как календарный день в UTC; «сегодня» — по Минску.
export function studioToday() {
  return new Date(new Date(Date.now() + 3 * 3600000).toISOString().slice(0, 10));
}

export async function createGroupLesson(group: any, date: Date) {
  const session = await mongoose.startSession();
  let result: { lesson: any; created: boolean } | undefined;
  try {
    await session.withTransaction(async () => {
      const existing = await Lesson.findOne({ group: group._id, date }).session(session);
      if (existing) {
        result = { lesson: existing, created: false };
        return;
      }
      const [lesson] = await Lesson.create([{ group: group._id, date }], { session });
      // Только новый урок на сегодня. Старые уроки и повторные запросы не списывают.
      if (date.getTime() === studioToday().getTime()) {
        const students = await GroupStudent.find({ _id: { $in: group.students } })
          .select("activeSubscription").session(session);
        for (const student of students) {
          if (!student.activeSubscription) continue;
          const sub = await Subscription.findOne({
            _id: student.activeSubscription,
            student: student._id,
          }).session(session);
          if (!sub) continue;
          const coverage = await consumeSubscriptionLesson(sub, lesson, session);
          if (!coverage) {
            await GroupStudent.updateOne({ _id: student._id, activeSubscription: sub._id },
              { $set: { activeSubscription: null } }, { session });
            continue;
          }
          await Attendance.create([{
            lesson: lesson._id, student: student._id,
            present: false, source: "subscription", consumed: coverage === "charged",
            subscriptionCompensation: coverage === "compensation",
            chargedSubscription: sub._id,
            payment: { paymentId: sub._id, type: "subscription", amount: 84, date },
          }], { session });
          if (canRetireSubscription(sub)) {
            await GroupStudent.updateOne({ _id: student._id, activeSubscription: sub._id },
              { $set: { activeSubscription: null } }, { session });
          }
        }
      }
      result = { lesson, created: true };
    });
    return result!;
  } catch (error: any) {
    if (error?.code === 11000) {
      const lesson = await Lesson.findOne({ group: group._id, date });
      if (lesson) return { lesson, created: false };
    }
    throw error;
  } finally {
    await session.endSession();
  }
}
