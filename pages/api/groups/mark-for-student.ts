import { connectDB, requireGroupAccess, requireTeacher } from "@/helpers/helpers";
import { NextApiRequest, NextApiResponse } from "next";
import Student from "@/models/group-student-model";
import { isValidObjectId } from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const user = await requireTeacher({ req, res });
  if (!user) return;

  const { action, groupId, studentId, text, messageUuid } = req.body;

  if (typeof groupId !== "string" || typeof studentId !== "string" ||
      !isValidObjectId(groupId) || !isValidObjectId(studentId)) {
    return res.status(400).json({ message: "Укажите группу и ученика" });
  }
  if (!["add", "edit", "delete"].includes(action)) {
    return res.status(400).json({ message: "Неизвестное действие" });
  }
  if (action !== "delete" && (typeof text !== "string" || !text.trim())) {
    return res.status(400).json({ message: "Введите текст заметки" });
  }
  if (action !== "add" && (typeof messageUuid !== "string" || !messageUuid)) {
    return res.status(400).json({ message: "Укажите заметку" });
  }

  const group = await requireGroupAccess(groupId, user, res);
  if (!group) return;
  if (!group.students.some((id: unknown) => String(id) === studentId)) {
    return res.status(403).json({ message: "Ученик не состоит в группе" });
  }

  const student = await Student.findById(studentId);
  if (!student) {
    return res.status(404).json("Student not found");
  }

  try {
    // ➕ ADD
    if (action === "add") {
      student.messages.push({ text: text.trim() });
    }

    // ✏ EDIT
    if (action === "edit") {
      const message = student.messages.find((m: any) => m.uuid === messageUuid);
      if (!message) return res.status(404).json("Message not found");

      message.text = text.trim();
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
