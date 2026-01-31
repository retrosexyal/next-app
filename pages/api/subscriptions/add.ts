import { connectDB, requireTeacher } from "@/helpers/helpers";
import Subscription from "@/models/subscription-model";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await connectDB();
  const user = requireTeacher({ req, res });
  if (!user) return;

  const { studentId } = req.body;
  const sub = await Subscription.findOne({ student: studentId });
  if (!sub) return res.status(404).json("нет абонемента");

  sub.totalLessons += 1;
  await sub.save();

  res.json(sub);
}
