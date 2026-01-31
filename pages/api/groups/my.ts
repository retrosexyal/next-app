import type { NextApiRequest, NextApiResponse } from "next";

import Group from "@/models/group-model";
import { connectDB, requireTeacher } from "@/helpers/helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await connectDB();
  const user = requireTeacher({ req, res });
  if (!user) return;

  const groups = await Group.find({ ownerEmail: user.email });
  res.json(groups);
}
