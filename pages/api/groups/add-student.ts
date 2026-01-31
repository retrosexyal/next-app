import { connectDB, requireTeacher } from "@/helpers/helpers";
import { NextApiRequest, NextApiResponse } from "next";
import Student from "@/models/group-student-model";
import Group from "@/models/group-model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const user = requireTeacher({ req, res });
  if (!user) return;

  const { groupId, fullName, phone } = req.body;

  const student = await Student.create({
    fullName,
    phone,
    isTemp: true,
  });

  await Group.findByIdAndUpdate(groupId, {
    $push: { students: student._id },
  });

 res.status(200).json(student);
}
