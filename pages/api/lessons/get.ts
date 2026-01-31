import type { NextApiRequest, NextApiResponse } from "next";

import Lesson from "@/models/lesson-model";
import Group from "@/models/group-model";
import Attendance from "@/models/attendance-model";
import {
  connectDB,
  requireGroupAccess,
  requireTeacher,
} from "@/helpers/helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") return res.status(405).end();

  await connectDB();
  const user = requireTeacher({ req, res });
  if (!user) return;

  const lessonId = req.query.lessonId as string;
  if (!lessonId) return res.status(400).json("lessonId обязателен");

  const lesson = await Lesson.findById(lessonId);
  if (!lesson) return res.status(404).json("занятие не найдено");

  const group = await requireGroupAccess(String(lesson.group), user, res);
  if (!group) return;

  const fullGroup = await Group.findById(group._id).populate("students");
  const attendance = await Attendance.find({ lesson: lesson._id });

  return res.status(200).json({
    lesson,
    group: fullGroup,
    attendance,
  });
}
