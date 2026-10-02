import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { connectDB, requireAdmin } from "@/helpers/helpers";
import Subscription from "@/models/subscription-model";
import Student from "@/models/group-student-model";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  await connectDB();
  if (!requireAdmin({ req, res })) return;
  const { subscriptionId, remaining } = req.body || {};
  const count = Number(remaining);
  if (!subscriptionId || remaining === null || remaining === undefined || remaining === "" || !Number.isInteger(count) || count < 0) {
    return res.status(400).json({ message: "Укажите целый остаток от 0" });
  }
  const session = await mongoose.startSession();
  let result: any;
  try {
    await session.withTransaction(async () => {
      const sub = await Subscription.findById(subscriptionId).session(session);
      if (!sub) throw new Error("Абонемент не найден");
      const student = await Student.findById(sub.student).session(session);
      if (!student || String(student.activeSubscription) !== String(sub._id)) throw new Error("Абонемент уже завершён. Создайте новый.");
      sub.totalLessons = Math.max(Number(sub.totalLessons || 0), count);
      sub.usedLessons = sub.totalLessons - count;
      await sub.save({ session });
      if (count === 0) {
        student.activeSubscription = null;
        await student.save({ session });
      }
      result = sub;
    });
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Не удалось изменить остаток" });
  } finally { await session.endSession(); }
}
