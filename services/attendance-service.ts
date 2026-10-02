import mongoose from "mongoose";
import Attendance from "@/models/attendance-model";
import Subscription from "@/models/subscription-model";
import Student from "@/models/group-student-model";
import { canRetireSubscription, consumeSubscriptionLesson } from "@/services/subscription-policy";
export type PaymentMode = "single" | "relative" | "subscription";

// Списание хранится независимо от присутствия и выбранной оплаты.
export async function saveAttendancePayment(lesson: any, studentId: string, mode: PaymentMode) {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      let attendance = await Attendance.findOne({ lesson: lesson._id, student: studentId }).session(session);
      if (!attendance) {
        [attendance] = await Attendance.create([{ lesson: lesson._id, student: studentId }], { session });
      }
      if (!attendance.chargedSubscription && attendance.consumed && attendance.source === "subscription") {
        attendance.chargedSubscription = attendance.payment?.paymentId;
      }
      const alreadyCharged = Boolean(attendance.chargedSubscription || attendance.consumed);
      if (mode === "subscription" && !alreadyCharged) {
        const student = await Student.findById(studentId).session(session);
        if (!student) throw new Error("Ученик не найден");
        let sub = student.activeSubscription
          ? await Subscription.findOne({ _id: student.activeSubscription, student: studentId }).session(session)
          : null;
        let coverage = sub ? await consumeSubscriptionLesson(sub, lesson, session) : null;
        if (!coverage) {
          [sub] = await Subscription.create([{ student: studentId, totalLessons: 8, usedLessons: 0, autoMissCompensation: true }], { session });
          student.activeSubscription = sub._id;
          coverage = await consumeSubscriptionLesson(sub, lesson, session);
        }
        attendance.chargedSubscription = sub._id;
        attendance.consumed = coverage === "charged";
        attendance.subscriptionCompensation = coverage === "compensation";
        if (canRetireSubscription(sub)) student.activeSubscription = null;
        await student.save({ session });
      }
      attendance.present = true;
      attendance.source = mode === "subscription" ? "subscription" : "single";
      attendance.payment = {
        ...(mode === "subscription" && attendance.chargedSubscription
          ? { paymentId: attendance.chargedSubscription } : {}),
        type: mode === "subscription" ? "subscription" : "single",
        amount: mode === "subscription" ? 84 : mode === "relative" ? 9 : 12,
        date: lesson.date,
      };
      await attendance.save({ session });
    });
  } finally { await session.endSession(); }
}
