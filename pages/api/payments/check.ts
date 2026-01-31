import type { NextApiRequest, NextApiResponse } from "next";

import Group from "@/models/group-model";

import "@/models/group-student-model";
import { connectDB, requireTeacher } from "@/helpers/helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await connectDB();
  const user = requireTeacher({ req, res });
  if (!user) return;

  const { groupId } = req.body;
  const group = await Group.findById(groupId).populate("students");

  // временно: считаем что у всех есть оплата
  const map: Record<string, boolean> = {};
  group.students.forEach((s: any) => (map[s._id] = true));

  res.json(map);
}
