import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB, requireTeacher } from "@/helpers/helpers";
import Attendance from "@/models/attendance-model";
import Subscription from "@/models/subscription-model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const user = requireTeacher({ req, res });
  if (!user) return;

  const { lessonId, studentId } = req.body;
  if (!lessonId || !studentId) {
    return res.status(400).json("lessonId и studentId обязательны");
  }

  const attendance = await Attendance.findOne({
    lesson: lessonId,
    student: studentId,
  });

  if (!attendance) return res.json({ ok: true });

  // если был списан абонемент — возвращаем урок
  if (attendance.source === "subscription" && attendance.consumed) {
    const sub = await Subscription.findOne({ student: studentId });
    if (sub && sub.usedLessons > 0) {
      sub.usedLessons -= 1;
      await sub.save();
    }
  }

  await Attendance.deleteOne({ _id: attendance._id });

  return res.json({ ok: true });
}
