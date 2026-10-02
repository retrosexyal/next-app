import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB, requireTeacher, requireGroupAccess } from "@/helpers/helpers";
import Lesson from "@/models/lesson-model";
import Attendance from "@/models/attendance-model";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  await connectDB();
  const user = await requireTeacher({ req, res });
  if (!user) return;
  const { lessonId, studentId } = req.body || {};
  if (!lessonId || !studentId) return res.status(400).json({ message: "Укажите занятие и ученика" });
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) return res.status(404).json({ message: "Занятие не найдено" });
  if (!await requireGroupAccess(String(lesson.group), user, res)) return;
  // Сохраняем оплату и списание для повторной отметки; при отсутствии отчёт даёт 0.
  await Attendance.updateOne({ lesson: lessonId, student: studentId }, { $set: { present: false } });
  return res.json({ ok: true });
}
