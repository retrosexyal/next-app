import type { NextApiRequest, NextApiResponse } from "next";

import Group from "@/models/group-model";
import { requireAdmin, connectDB } from "@/helpers/helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const admin = requireAdmin({ req, res });
  if (!admin) return;

  const { id } = req.body;
  await Group.findByIdAndDelete(id);

  res.json({ ok: true });
}
