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

  const { action, studentId, text, messageUuid } = req.body;

  const student = await Student.findById(studentId);
  if (!student) {
    return res.status(404).json("Student not found");
  }

  try {
    // ➕ ADD
    if (action === "add") {
      student.messages.push({ text });
    }

    // ✏ EDIT
    if (action === "edit") {
      const message = student.messages.find((m: any) => m.uuid === messageUuid);
      if (!message) return res.status(404).json("Message not found");

      message.text = text;
    }

    // ❌ DELETE
    if (action === "delete") {
      student.messages = student.messages.filter(
        (m: any) => m.uuid !== messageUuid,
      );
    }

    await student.save();

    return res.status(200).json(student.messages);
  } catch (error) {
    return res.status(500).json("Server error");
  }
}
