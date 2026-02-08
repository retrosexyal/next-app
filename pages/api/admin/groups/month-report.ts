import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB, requireAdmin } from "@/helpers/helpers";
import Group from "@/models/group-model";
import Lesson from "@/models/lesson-model";
import Attendance from "@/models/attendance-model";
import "@/models/group-student-model";

const SUB_LESSON_PRICE = 84 / 8; // 10.5

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const admin = requireAdmin({ req, res });
  if (!admin) return;

  const { groupId, month } = req.body;
  if (!groupId || !month) {
    return res.status(400).json("groupId и month обязательны");
  }

  const [year, m] = month.split("-").map(Number);

  const from = new Date(Date.UTC(year, m - 1, 1));
  const to = new Date(Date.UTC(year, m, 1));

  const group = await Group.findById(groupId).populate("students");
  if (!group) return res.status(404).json("группа не найдена");

  const lessons = await Lesson.find({
    group: group._id,
    date: { $gte: from, $lt: to },
  }).sort({ date: 1 });

  const lessonMap = new Map(
    lessons.map((l) => [String(l._id), l]),
  );

  const dates = lessons.map((l) =>
    l.date.toISOString().slice(0, 10),
  );

  const attendances = await Attendance.find({
    lesson: { $in: lessons.map((l) => l._id) },
  }).populate("student");

  const matrix: Record<
    string,
    Record<string, { present: boolean; amount: number }>
  > = {};

  const totalsByDate: Record<string, number> = {};
  const totalsByStudent: Record<string, number> = {};

  for (const a of attendances) {
    if (!a.student || !a.lesson) continue;

    const studentId = String((a.student as any)._id);
    const lesson = lessonMap.get(String(a.lesson));
    if (!lesson) continue;

    const dateKey = lesson.date.toISOString().slice(0, 10);

    if (!matrix[studentId]) matrix[studentId] = {};

    let amount = 0;

    if (a.present && !a.refunded) {
      if (a.payment?.type === "subscription") {
        amount = SUB_LESSON_PRICE;
      } else if (a.payment?.type === "single") {
        amount = a.payment.amount || 0;
      }
    }

    matrix[studentId][dateKey] = {
      present: Boolean(a.present),
      amount,
    };

    totalsByDate[dateKey] = (totalsByDate[dateKey] || 0) + amount;
    totalsByStudent[studentId] =
      (totalsByStudent[studentId] || 0) + amount;
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
