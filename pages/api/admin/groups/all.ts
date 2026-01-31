import type { NextApiRequest, NextApiResponse } from "next";

import Group from "@/models/group-model";
import { connectDB, requireAdmin } from "@/helpers/helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") return res.status(405).end();

  await connectDB();
  const admin = requireAdmin({ req, res });
  if (!admin) return;

  const groups = await Group.find().sort({ createdAt: -1 });
  res.json(groups);
}
