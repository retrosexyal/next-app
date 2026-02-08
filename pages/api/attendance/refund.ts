import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB, requireAdmin } from "@/helpers/helpers";
import Attendance from "@/models/attendance-model";
import Subscription from "@/models/subscription-model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const admin = requireAdmin({ req, res });
  if (!admin) return;

  const { attendanceId, reason } = req.body;
  if (!attendanceId || !reason) {
    return res.status(400).json("attendanceId и reason обязательны");
  }

  const attendance = await Attendance.findById(attendanceId);
  if (!attendance) return res.status(404).json("attendance не найден");

  if (!attendance.consumed || attendance.refunded) {
    return res.json({ ok: true }); // уже обработано
  }

  if (attendance.source === "subscription") {
    const sub = await Subscription.findOne({ student: attendance.student });
    if (sub && sub.usedLessons > 0) {
      sub.usedLessons -= 1;
      await sub.save();
    }
  }

  attendance.refunded = true;
  attendance.refundReason = reason;
  await attendance.save();

  return res.json({ ok: true });
}
