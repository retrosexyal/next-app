import type { NextApiRequest, NextApiResponse } from "next";

import { createGroupLesson, studioToday } from "@/services/lesson-service";
import {
  connectDB,
  requireGroupAccess,
  requireTeacher,
} from "@/helpers/helpers";

type Body = {
  groupId: string;
  date?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const user = await requireTeacher({ req, res });
  if (!user) return;

  const { groupId, date } = req.body as Body;
  if (!groupId) return res.status(400).json("groupId и date обязательны");

  const group = await requireGroupAccess(groupId, user, res);
  if (!group) return;

  const d = date ? new Date(date) : studioToday();
  if (date && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(d.getTime()) || d.toISOString().slice(0, 10) !== date || d > studioToday())) {
    return res.status(400).json({ message: "Некорректная дата занятия" });
  }

  try {
    const { lesson } = await createGroupLesson(group, d);

    return res.status(200).json(lesson);
  } catch (e) {
    console.error("lesson create error:", e);
    return res.status(500).json("ошибка создания занятия");
  }
}
