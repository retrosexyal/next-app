import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB, requireTeacher, requireGroupAccess } from "@/helpers/helpers";
import Lesson from "@/models/lesson-model";
import Attendance from "@/models/attendance-model";
// Повторная синхронизация меняет только присутствие, без списаний.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  await connectDB();
  const user = await requireTeacher({ req, res });
  if (!user) return;
  const { lessonId, items } = req.body || {};
  if (!lessonId || !Array.isArray(items) || items.some((item) => !item || typeof item.studentId !== "string" || typeof item.present !== "boolean")) {
    return res.status(400).json({ message: "Некорректные отметки" });
  }
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) return res.status(404).json({ message: "Занятие не найдено" });
  const group = await requireGroupAccess(String(lesson.group), user, res);
  if (!group) return;
  const members = new Set(group.students.map((id: unknown) => String(id)));
  if (items.some((item) => !members.has(item.studentId))) return res.status(400).json({ message: "Ученик не состоит в группе" });
  for (const item of items) {
    await Attendance.updateOne({ lesson: lesson._id, student: item.studentId }, {
      $set: { present: item.present },
      $setOnInsert: { source: "free", consumed: false, refunded: false },
    }, { upsert: true });
  }
  return res.json(await Attendance.find({ lesson: lesson._id }).populate("student"));
}
