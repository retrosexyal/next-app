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
  source?: AttendanceSource;
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

  const subs = await Subscription.find({
    student: { $in: items.map((i) => i.studentId) },
  }).lean();

  const subSet = new Set(subs.map((s) => String(s.student)));

  // 1) upsert посещаемости
  const ops = items.map((it) => ({
    updateOne: {
      filter: { lesson: lesson._id, student: it.studentId },
      update: {
        $set: {
          present: Boolean(it.present),
        },
        $setOnInsert: {
          source: subSet.has(it.studentId) ? "subscription" : "free",
          consumed: false,
        },
      },
      upsert: true,
    },
  }));

  await Attendance.bulkWrite(ops);

  // 2) автосписание по абонементу
  const saved = await Attendance.find({ lesson: lesson._id });

  for (const a of saved) {
    if (a.present && a.source === "subscription" && !a.consumed) {
      const sub = await Subscription.findOne({ student: a.student });
      if (!sub) continue;

      if (sub.usedLessons < sub.totalLessons) {
        sub.usedLessons += 1;
        await sub.save();

        a.consumed = true;
        await a.save();
      }
    }
  }

  const result = await Attendance.find({ lesson: lesson._id }).populate(
    "student",
  );

  return res.status(200).json(result);
}
