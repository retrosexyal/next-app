import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { connectDB, requireAdmin } from "@/helpers/helpers";
import { deleteGroupLesson, LessonDeletionError } from "@/services/lesson-deletion-service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", "DELETE");
    return res.status(405).end();
  }
  await connectDB();
  if (!requireAdmin({ req, res })) return;
  const { lessonId, groupId } = req.body || {};
  if (typeof lessonId !== "string" || typeof groupId !== "string" ||
      !mongoose.isValidObjectId(lessonId) || !mongoose.isValidObjectId(groupId)) {
    return res.status(400).json({ message: "Некорректное занятие или группа" });
  }
  try {
    return res.json(await deleteGroupLesson(lessonId, groupId));
  } catch (error) {
    if (error instanceof LessonDeletionError) return res.status(409).json({ message: error.message });
    console.error("admin lesson delete error:", error);
    return res.status(500).json({ message: "Не удалось удалить занятие. Изменения отменены." });
  }
}
