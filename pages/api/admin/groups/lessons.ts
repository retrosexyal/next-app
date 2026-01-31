import { NextApiRequest, NextApiResponse } from "next";
import { connectDB, requireAdmin } from "@/helpers/helpers";
import Lesson from "@/models/lesson-model";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const admin = requireAdmin({ req, res });
  if (!admin) return;

  const { groupId } = req.query;

  const lessons = await Lesson.find({ group: groupId })
    .sort({ date: -1 })
    .limit(30);

  res.json(lessons);
}
