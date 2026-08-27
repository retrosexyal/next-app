import type { NextApiRequest, NextApiResponse } from "next";

import { connectDB, requireAdmin } from "@/helpers/helpers";
import Group from "@/models/group-model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const admin = requireAdmin({ req, res });
  if (!admin) return;

  const groupId = typeof req.body.groupId === "string" ? req.body.groupId : "";
  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";

  if (!groupId || !title) {
    return res.status(400).json({ message: "Введите название группы" });
  }
  if (title.length > 100) {
    return res.status(400).json({ message: "Название не должно превышать 100 символов" });
  }

  const group = await Group.findByIdAndUpdate(
    groupId,
    { $set: { title } },
    { new: true },
  );
  if (!group) {
    return res.status(404).json({ message: "Группа не найдена" });
  }

  return res.status(200).json(group);
}
