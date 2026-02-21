import { connectDB, requireTeacher } from "@/helpers/helpers";
import { NextApiRequest, NextApiResponse } from "next";
import Student from "@/models/group-student-model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const user = requireTeacher({ req, res });
  if (!user) return;

  const { message, studentId } = req.body;

  const student = await Student.findById(studentId);

  if (!student) {
    return res.status(404).json("net takogo");
  }

  student.message = message;

  console.log(message);

  const updatedStudent = await student.save();

  return res.status(200).json(updatedStudent);
}
