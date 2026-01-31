import type { NextApiRequest, NextApiResponse } from "next";

import Lesson from "@/models/lesson-model";
import {
  connectDB,
  requireGroupAccess,
  requireTeacher,
} from "@/helpers/helpers";

type Body = {
  groupId: string;
  date: string; // ISO
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const user = requireTeacher({ req, res });
  if (!user) return;

  const { groupId, date } = req.body as Body;
  if (!groupId || !date)
    return res.status(400).json("groupId и date обязательны");

  const group = await requireGroupAccess(groupId, user, res);
  if (!group) return;

  const d = new Date(date);
  if (Number.isNaN(d.getTime())) {
    return res.status(400).json("некорректная дата");
  }

  // 🔒 нормализуем к началу дня
  d.setHours(0, 0, 0, 0);

  try {
    // ищем или создаём
    let lesson = await Lesson.findOne({
      group: group._id,
      date: d,
    });

    if (!lesson) {
      lesson = await Lesson.create({
        group: group._id,
        date: d,
      });
    }

    return res.status(200).json(lesson);
  } catch (e) {
    console.error("lesson create error:", e);
    return res.status(500).json("ошибка создания занятия");
  }
}
