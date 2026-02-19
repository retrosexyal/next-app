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

  const { subscriptionId, remaining } = req.body;

  if (!subscriptionId) {
    return res
      .status(400)
      .json("subscriptionId, remaining (>=0), reason обязательны");
  }

  const sub = await Subscription.findById(subscriptionId);
  if (!sub) return res.status(404).json("абонемент не найден");

  sub.usedLessons = remaining;
  await sub.save();

  return res.json(sub);
}
