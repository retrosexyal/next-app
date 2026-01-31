import type { NextApiRequest, NextApiResponse } from "next";
import Group from "@/models/group-model";
import { connectDB, requireAdmin } from "@/helpers/helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const admin = requireAdmin({ req, res });
  if (!admin) return;

  const { groupId, studentId } = req.body;

  await Group.findByIdAndUpdate(groupId, {
    $pull: { students: studentId },
  });

  res.json({ ok: true });
}
