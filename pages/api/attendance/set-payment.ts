import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB, requireTeacher, requireGroupAccess } from "@/helpers/helpers";
import Lesson from "@/models/lesson-model";
import { saveAttendancePayment } from "@/services/attendance-service";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  await connectDB();
  const user = await requireTeacher({ req, res });
  if (!user) return;
  const { lessonId, studentId, mode } = req.body || {};
  if (!lessonId || !studentId || !["single", "relative", "subscription"].includes(mode)) {
    return res.status(400).json({ message: "Некорректная отметка" });
  }
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) return res.status(404).json({ message: "Занятие не найдено" });
  const group = await requireGroupAccess(String(lesson.group), user, res);
  if (!group) return;
  if (!group.students.some((id: unknown) => String(id) === studentId)) {
    return res.status(400).json({ message: "Ученик не состоит в группе" });
  }
  try {
    await saveAttendancePayment(lesson, studentId, mode);
    return res.json({ ok: true });
  } catch (error) {
    console.error("attendance payment error:", error);
    return res.status(500).json({ message: "Отметка не сохранена. Повторите запрос." });
  }
}
