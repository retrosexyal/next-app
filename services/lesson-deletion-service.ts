import mongoose from "mongoose";
import Lesson from "@/models/lesson-model";
import Attendance from "@/models/attendance-model";
import Subscription from "@/models/subscription-model";
import Student from "@/models/group-student-model";
import { canRetireSubscription } from "@/services/subscription-policy";

export class LessonDeletionError extends Error {}

export async function deleteGroupLesson(lessonId: string, groupId: string) {
  const session = await mongoose.startSession();
  let refundedLessons = 0;
  try {
    await session.withTransaction(async () => {
      refundedLessons = 0;
      // Запись в Lesson также сериализует удаление с изменениями посещаемости.
      const lesson = await Lesson.findOneAndDelete({ _id: lessonId, group: groupId }, { session });
      if (!lesson) return; // Повторное удаление ничего не возвращает.
      const rows = await Attendance.find({ lesson: lessonId }).session(session);
      const subs = await Subscription.find({ $or: [
        { _id: { $in: rows.map((a: any) => a.chargedSubscription || a.payment?.paymentId).filter(Boolean) } },
        { lastChargedLesson: lessonId }, { compensationLesson: lessonId },
        { compensatedMissedLesson: lessonId },
      ] }).session(session);
      for (const row of rows) {
        if (!row.consumed || row.refunded) continue;
        const subId = row.chargedSubscription || row.payment?.paymentId;
        const sub = subs.find((s: any) => String(s._id) === String(subId) && String(s.student) === String(row.student));
        if (!sub || sub.usedLessons < 1) {
          throw new LessonDeletionError("Не удалось определить списанный абонемент. Удаление отменено, проверьте данные посещаемости.");
        }
        sub.usedLessons -= 1;
        refundedLessons += 1;
      }
      await Attendance.deleteMany({ lesson: lessonId }, { session });
      for (const sub of subs) {
        if (String(sub.compensationLesson) === lessonId) {
          sub.compensationLesson = undefined;
          sub.compensatedMissedLesson = undefined;
        } else if (String(sub.compensatedMissedLesson) === lessonId) {
          // Уже предоставленную компенсацию сохраняем, но убираем ссылку на удалённый пропуск.
          sub.compensatedMissedLesson = undefined;
        }
        if (String(sub.lastChargedLesson) === lessonId) {
          const remaining = await Attendance.find({
            student: sub.student, consumed: true, refunded: { $ne: true },
            $or: [{ chargedSubscription: sub._id }, { chargedSubscription: { $exists: false }, "payment.paymentId": sub._id }],
          }).session(session);
          const latest = await Lesson.findOne({ _id: { $in: remaining.map((a: any) => a.lesson) } })
            .sort({ date: -1, _id: -1 }).session(session);
          sub.lastChargedLesson = latest?._id;
        }
        const student = await Student.findById(sub.student).session(session);
        if (student && !canRetireSubscription(sub)) {
          const current = student.activeSubscription && String(student.activeSubscription) !== String(sub._id)
            ? await Subscription.findOne({ _id: student.activeSubscription, student: sub.student }).session(session) : null;
          if (current) {
            // Остаток старого абонемента переносим в текущий, чтобы он был доступен ученику.
            current.totalLessons += sub.totalLessons - sub.usedLessons;
            sub.totalLessons = sub.usedLessons;
            await current.save({ session });
          } else {
            student.activeSubscription = sub._id;
            await student.save({ session });
          }
        }
        await sub.save({ session });
      }
    });
    return { refundedLessons };
  } finally {
    await session.endSession();
  }
}
