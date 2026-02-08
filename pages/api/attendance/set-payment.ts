import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB, requireTeacher } from "@/helpers/helpers";
import Attendance from "@/models/attendance-model";
import Lesson from "@/models/lesson-model";
import Subscription from "@/models/subscription-model";
import Payment from "@/models/payment-model";
import { Types } from "mongoose";

type Body = {
  lessonId: string;
  studentId: string;
  mode: "single" | "subscription" | "relative";
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const user = requireTeacher({ req, res });
  if (!user) return;

  const { lessonId, studentId, mode } = req.body as Body;
  if (!lessonId || !studentId || !mode) {
    return res.status(400).json("lessonId, studentId, mode обязательны");
  }

  const lesson = await Lesson.findById(lessonId);
  if (!lesson) return res.status(404).json("занятие не найдено");

  let paymentSnapshot: any = null;
  let source: "single" | "subscription" | "free" = "free";
  let consumed = false;

  // ---- РАЗОВОЕ ----
  if (mode === "single") {
    source = "single";

    paymentSnapshot = {
      type: "single",
      amount: 12,
      date: lesson.date,
    };
  }

  // ---- РОДСТВЕННИК ----
  if (mode === "relative") {
    source = "single";

    paymentSnapshot = {
      type: "single",
      amount: 9,
      date: lesson.date,
    };
  }

  // ---- АБОНЕМЕНТ ----
  if (mode === "subscription") {
    source = "subscription";

    let sub = await Subscription.findOne({ student: studentId });

    if (!sub) {
      // создаём новый абонемент
      sub = await Subscription.create({
        student: studentId,
        totalLessons: 8,
        usedLessons: 0,
      });
    }

    if (sub.usedLessons < sub.totalLessons) {
      sub.usedLessons += 1;
      await sub.save();
      consumed = true;
    }

    paymentSnapshot = {
      paymentId: sub._id,
      type: "subscription",
      amount: 84,
      date: lesson.date,
    };
  }

  console.log(paymentSnapshot);

  // ---- upsert Attendance ----
  await Attendance.updateOne(
    { lesson: lessonId, student: studentId },
    {
      $set: {
        present: true,
        source,
        consumed,
        payment: paymentSnapshot,
      },
    },
    { upsert: true },
  );

  return res.json({ ok: true });
}
