import { connectDB, requireTeacher } from "@/helpers/helpers";
import { NextApiRequest, NextApiResponse } from "next";

import "@/models/group-student-model";
import Group from "@/models/group-model";
import Lesson from "@/models/lesson-model";
import Attendance from "@/models/attendance-model";
import Subscription from "@/models/subscription-model";
import "@/models/subscription-model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") return res.status(405).end();

  await connectDB();
  const user = requireTeacher({ req, res });
  if (!user) return;

  const { id } = req.query;
  if (!id) return res.status(400).json("id обязателен");

  const group = await Group.findById(id).populate({
    path: "students",
    populate: {
      path: "activeSubscription",
      select: "totalLessons usedLessons",
    },
  });

  if (!group) return res.status(404).json("группа не найдена");

  // ---- сегодня (по локальному времени) ----
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  // ---- ищем занятие ----
  const lesson = await Lesson.findOne({
    group: group._id,
    date: { $gte: start, $lt: end },
  });

  let attendanceMap: Record<string, any> = {};

  if (lesson) {
    const atts = await Attendance.find({ lesson: lesson._id });
    atts.forEach((a) => {
      attendanceMap[String(a.student)] = {
        present: a.present,
        source: a.source,
      };
    });
  }

  const result = {
    ...group.toObject(),
    students: group.students.map((s: any) => ({
      ...s.toObject(),
      todayAttendance: attendanceMap[String(s._id)] || null,
    })),
  };

  return res.status(200).json(result);
}
