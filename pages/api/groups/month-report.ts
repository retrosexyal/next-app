import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB, requireTeacher } from "@/helpers/helpers";
import Group from "@/models/group-model";
import Lesson from "@/models/lesson-model";
import Attendance from "@/models/attendance-model";
import "@/models/group-student-model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const teacher = requireTeacher({ req, res });
  if (!teacher) return;

  const { groupId, month } = req.body;
  if (!groupId || !month) {
    return res.status(400).json("groupId и month обязательны");
  }

  const [year, m] = month.split("-").map(Number);

  const from = new Date(Date.UTC(year, m - 1, 1));
  const to = new Date(Date.UTC(year, m, 1));

  const group = await Group.findById(groupId).populate("students");
  if (!group) return res.status(404).json("группа не найдена");

  // 🔐 защита — учитель видит только свою группу
  if (String(group.ownerEmail) !== String(teacher.email)) {
    return res.status(403).json("нет доступа");
  }

  const lessons = await Lesson.find({
    group: group._id,
    date: { $gte: from, $lt: to },
  }).sort({ date: 1 });

  const lessonMap = new Map(lessons.map((l) => [String(l._id), l]));

  const dates = lessons.map((l) => l.date.toISOString().slice(0, 10));

  const attendances = await Attendance.find({
    lesson: { $in: lessons.map((l) => l._id) },
  }).populate("student");

  const matrix: Record<string, Record<string, boolean>> = {};
  const totalsByDate: Record<string, number> = {};
  const totalsByStudent: Record<string, number> = {};

  for (const a of attendances) {
    if (!a.student || !a.lesson) continue;

    const studentId = String((a.student as any)._id);
    const lesson = lessonMap.get(String(a.lesson));
    if (!lesson) continue;

    const dateKey = lesson.date.toISOString().slice(0, 10);

    if (!matrix[studentId]) matrix[studentId] = {};

    const present = Boolean(a.present && !a.refunded);

    matrix[studentId][dateKey] = present;

    if (present) {
      totalsByDate[dateKey] = (totalsByDate[dateKey] || 0) + 1;
      totalsByStudent[studentId] = (totalsByStudent[studentId] || 0) + 1;
    }
  }

  const students = group.students.map((s: any) => ({
    _id: s._id,
    fullName: s.fullName,
  }));

  return res.json({
    students,
    dates,
    matrix,
    totalsByDate,
    totalsByStudent,
  });
}
