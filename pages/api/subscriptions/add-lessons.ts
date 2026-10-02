import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { connectDB, requireAdmin } from "@/helpers/helpers";
import Subscription from "@/models/subscription-model";
import Student from "@/models/group-student-model";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  await connectDB();
  if (!requireAdmin({ req, res })) return;
  const { subscriptionId, studentId, count } = req.body || {};
  if (count === null || count === undefined || count === "" || !Number.isInteger(Number(count)) || Number(count) < 0) {
    return res.status(400).json({ message: "Укажите целое количество занятий от 0" });
  }
  const session = await mongoose.startSession();
  let result: any;
  try {
    await session.withTransaction(async () => {
      let sub = subscriptionId ? await Subscription.findById(subscriptionId).session(session) : null;
      if (subscriptionId && !sub) throw new Error("Абонемент не найден");
      const student = await Student.findById(sub?.student || studentId).session(session);
      if (!student) throw new Error("Ученик не найден");
      if (!sub && student.activeSubscription) {
        // Повтор запроса создания после потери ответа не создаёт второй абонемент.
        sub = await Subscription.findById(student.activeSubscription).session(session);
        if (sub && sub.usedLessons < sub.totalLessons) { result = sub; return; }
        sub = null;
      }
      if (!sub) {
        if (Number(count) === 0) throw new Error("Для нового абонемента нужно хотя бы одно занятие");
        [sub] = await Subscription.create([{ student: student._id, totalLessons: Number(count), usedLessons: 0 }], { session });
        student.activeSubscription = sub._id;
      } else {
        if (String(student.activeSubscription) !== String(sub._id)) throw new Error("Абонемент уже завершён. Создайте новый.");
        sub.totalLessons = Number(count);
        sub.usedLessons = Math.min(sub.usedLessons || 0, sub.totalLessons);
        await sub.save({ session });
      }
      if (sub.usedLessons >= sub.totalLessons) student.activeSubscription = null;
      await student.save({ session });
      result = sub;
    });
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Не удалось сохранить абонемент" });
  } finally { await session.endSession(); }
}
