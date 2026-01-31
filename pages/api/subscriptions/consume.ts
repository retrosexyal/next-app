import { NextApiRequest, NextApiResponse } from "next";
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

  const { attendanceId } = req.body;
  if (!attendanceId)
    return res.status(400).json("attendanceId обязателен");

  const att = await Attendance.findById(attendanceId);
  if (!att || !att.present)
    return res.status(400).json("нет посещения");

  if (att.source !== "subscription")
    return res.status(400).json("не абонемент");

  // защита от повторного списания
  if (att.consumed) return res.json("уже списано");

  const sub = await Subscription.findOne({ student: att.student });
  if (!sub) return res.status(404).json("нет абонемента");

  if (sub.usedLessons >= sub.totalLessons)
    return res.status(400).json("абонемент исчерпан");

  sub.usedLessons += 1;
  await sub.save();

  att.consumed = true;
  await att.save();

  res.json({ left: sub.totalLessons - sub.usedLessons });
}
