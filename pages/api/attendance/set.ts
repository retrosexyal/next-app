import type { NextApiRequest, NextApiResponse } from "next";

import Lesson from "@/models/lesson-model";
import Attendance, { AttendanceSource } from "@/models/attendance-model";
import Subscription from "@/models/subscription-model";
import {
  connectDB,
  requireGroupAccess,
  requireTeacher,
} from "@/helpers/helpers";
import "@/models/group-student-model";

type AttendanceItem = {
  studentId: string;
  present: boolean;
};

type Body = {
  lessonId: string;
  items: AttendanceItem[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const user = requireTeacher({ req, res });
  if (!user) return;

  const { lessonId, items } = req.body as Body;
  if (!lessonId || !Array.isArray(items)) {
    return res.status(400).json("lessonId и items обязательны");
  }

  const lesson = await Lesson.findById(lessonId);
  if (!lesson) return res.status(404).json("занятие не найдено");

  const group = await requireGroupAccess(String(lesson.group), user, res);
  if (!group) return;

  // заранее вытаскиваем абонементы учеников
  const subs = await Subscription.find({
    student: { $in: items.map((i) => i.studentId) },
  });

  const subMap = new Map(
    subs.map((s) => [String(s.student), s]),
  );

  // 1️⃣ upsert Attendance (БЕЗ списаний)
  const ops = items.map((it) => {
    const studentId = it.studentId;
    const present = Boolean(it.present);

    const hasSub = subMap.has(studentId);
    const source: AttendanceSource = hasSub ? "subscription" : "free";

    return {
      updateOne: {
        filter: { lesson: lesson._id, student: studentId },
        update: {
          $set: {
            present,
            source,
          },
          $setOnInsert: {
            consumed: false,
            refunded: false,
          },
        },
        upsert: true,
      },
    };
  });

  if (ops.length) {
    await Attendance.bulkWrite(ops);
  }

  // 2️⃣ Списываем абонементы (СТРОГО 1 РАЗ)
  const attendances = await Attendance.find({
    lesson: lesson._id,
    source: "subscription",
  });

  for (const a of attendances) {
    if (a.consumed) continue;

    const sub = subMap.get(String(a.student));
    if (!sub) continue;

    if (sub.usedLessons < sub.totalLessons) {
      sub.usedLessons += 1;
      await sub.save();

      a.consumed = true;
      await a.save();
    }
  }

  // 3️⃣ отдаём результат
  const result = await Attendance.find({ lesson: lesson._id }).populate(
    "student",
  );

  return res.status(200).json(result);
}
