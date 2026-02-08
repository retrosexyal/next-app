import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB, requireAdmin } from "@/helpers/helpers";
import Subscription from "@/models/subscription-model";
import SubscriptionAdjustment from "@/models/subscription-adjustment-model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const admin = requireAdmin({ req, res });
  if (!admin) return;

  const { subscriptionId, remaining, reason } = req.body;
  const targetRemaining = Number(remaining);

  if (
    !subscriptionId ||
    !Number.isFinite(targetRemaining) ||
    targetRemaining < 0 ||
    !reason
  ) {
    return res
      .status(400)
      .json("subscriptionId, remaining (>=0), reason обязательны");
  }

  const sub = await Subscription.findById(subscriptionId);
  if (!sub) return res.status(404).json("абонемент не найден");

  // ❗ защита: нельзя сделать меньше, чем уже использовано
  if (targetRemaining < sub.totalLessons - sub.usedLessons) {
    return res
      .status(400)
      .json("remaining меньше уже использованных занятий");
  }

  const currentRemaining = sub.totalLessons - sub.usedLessons;
  const delta = targetRemaining - currentRemaining;

  if (delta === 0) {
    return res.json(sub);
  }

  sub.totalLessons += delta;
  await sub.save();

  await SubscriptionAdjustment.create({
    subscription: sub._id,
    admin: admin.id,
    delta,
    reason,
  });

  return res.json(sub);
}
