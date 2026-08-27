import { NextApiRequest, NextApiResponse } from "next";
import { connectDB, requireAdmin, TEACHERS } from "@/helpers/helpers";
import Group from "@/models/group-model";
import Teacher from "@/models/teacher-model";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const admin = requireAdmin({ req, res });
  if (!admin) return;

  const { groupId, ownerEmail } = req.body;
  if (!groupId || !ownerEmail)
    return res.status(400).json({ message: "Выберите преподавателя" });

  const isTeacher =
    TEACHERS.includes(ownerEmail) || Boolean(await Teacher.exists({ email: ownerEmail }));
  if (!isTeacher)
    return res.status(400).json({ message: "Преподаватель не найден" });

  const group = await Group.findByIdAndUpdate(
    groupId,
    { ownerEmail },
    { new: true },
  );
  if (!group) return res.status(404).json({ message: "Группа не найдена" });

  res.json(group);
}
