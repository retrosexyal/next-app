import { NextApiRequest, NextApiResponse } from "next";
import { connectDB, requireAdmin } from "@/helpers/helpers";
import Group from "@/models/group-model";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const admin = requireAdmin({ req, res });
  if (!admin) return;

  const { groupId, ownerEmail } = req.body;
  if (!groupId || !ownerEmail)
    return res.status(400).json("groupId и ownerEmail обязательны");

  await Group.findByIdAndUpdate(groupId, { ownerEmail });

  res.json({ ok: true });
}
