import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

import { connectDB, requireAdmin } from "@/helpers/helpers";
import Group from "@/models/group-model";
import Lesson from "@/models/lesson-model";
import { createGroupLesson, studioToday } from "@/services/lesson-service";

type Body = {
  groupId?: string;
  date?: string;
};

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function parseDate(value: string) {
  const match = DATE_PATTERN.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const admin = requireAdmin({ req, res });
  if (!admin) return;

  const { groupId, date: dateValue } = req.body as Body;
  if (!groupId || !dateValue) {
    return res.status(400).json({ message: "Выберите дату занятия" });
  }

  if (!mongoose.isValidObjectId(groupId)) {
    return res.status(400).json({ message: "Некорректная группа" });
  }

  const date = parseDate(dateValue);
  if (!date) {
    return res.status(400).json({ message: "Некорректная дата занятия" });
  }

  if (date > studioToday()) {
    return res
      .status(400)
      .json({ message: "Нельзя создать занятие на будущую дату" });
  }

  const group = await Group.findById(groupId).select("_id students");
  if (!group) {
    return res.status(404).json({ message: "Группа не найдена" });
  }

  const existingLesson = await Lesson.findOne({ group: group._id, date });
  if (existingLesson) {
    return res.status(200).json({ lesson: existingLesson, created: false });
  }

  try {
    const result = await createGroupLesson(group, date);
    return res.status(result.created ? 201 : 200).json(result);
  } catch (error: any) {
    // Параллельные запросы защищены уникальным индексом Lesson.
    if (error?.code === 11000) {
      const lesson = await Lesson.findOne({ group: group._id, date });
      return res.status(200).json({ lesson, created: false });
    }

    console.error("admin lesson create error:", error);
    return res.status(500).json({ message: "Не удалось создать занятие" });
  }
}
