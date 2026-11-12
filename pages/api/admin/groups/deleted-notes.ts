import { NextApiRequest, NextApiResponse } from "next";
import { isValidObjectId } from "mongoose";
import { connectDB, requireAdmin, requireGroupAccess } from "@/helpers/helpers";
import Student from "@/models/group-student-model";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();
  const admin = requireAdmin({ req, res });
  if (!admin) return;
  const { groupId, studentId } = req.query;
  if (typeof groupId !== "string" || typeof studentId !== "string" ||
      !isValidObjectId(groupId) || !isValidObjectId(studentId)) {
    return res.status(400).json({ message: "Укажите группу и ученика" });
  }
  await connectDB();
  const group = await requireGroupAccess(groupId, admin, res);
  if (!group) return;
  if (!group.students.some((id: unknown) => String(id) === studentId)) {
    return res.status(403).json({ message: "Ученик не состоит в группе" });
  }
  const student = await Student.findById(studentId).select("+deletedMessages");
  if (!student) return res.status(404).json({ message: "Ученик не найден" });
  return res.json([...student.deletedMessages].sort(
    (a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime(),
  ));
}
