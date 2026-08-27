import { connectDB, requireAdmin, TEACHERS } from "@/helpers/helpers";
import Group from "@/models/group-model";
import Teacher from "@/models/teacher-model";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const admin = requireAdmin({ req, res });
  if (!admin) return;

  const { title, ownerEmail } = req.body;

  const isTeacher =
    TEACHERS.includes(ownerEmail) || Boolean(await Teacher.exists({ email: ownerEmail }));
  if (!isTeacher) return res.status(400).json("преподаватель не найден");

  const group = await Group.create({
    title,
    ownerEmail,
    students: [],
  });

  res.status(200).json(group);
}
