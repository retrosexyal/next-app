import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB, requireAdmin } from "@/helpers/helpers";
import Subscription from "@/models/subscription-model";
import SubscriptionAdjustment from "@/models/subscription-adjustment-model";
import GroupStudent from "@/models/group-student-model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const admin = requireAdmin({ req, res });
  if (!admin) return;

  const { subscriptionId, count, studentId } = req.body;

  const delta = Number(count);

  const sub = await Subscription.findById(subscriptionId);

  if (!sub && studentId) {
    const sub = await Subscription.create({
      student: studentId,
      totalLessons: count || 8,
      usedLessons: 0,
    });

    await sub.save();

    const student = await GroupStudent.findById(studentId);

    if (!student) {
      return res.status(404).json("student not found");
    }

    if (!student.activeSubscription) {
      student.activeSubscription = sub._id;
      await student.save();
    }

    return res.json(sub);
  }

  sub.totalLessons = delta;
  await sub.save();

  return res.json(sub);
}
