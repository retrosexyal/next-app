import type { NextApiRequest, NextApiResponse } from "next";

import Lesson from "@/models/lesson-model";
import {
  connectDB,
  requireGroupAccess,
  requireTeacher,
} from "@/helpers/helpers";

type Body = {
  groupId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const user = requireTeacher({ req, res });
  if (!user) return;

  const { groupId } = req.body as Body;
  if (!groupId) return res.status(400).json("groupId и date обязательны");

  const group = await requireGroupAccess(groupId, user, res);
  if (!group) return;

  const nowUtc = new Date();
  const moscow = new Date(nowUtc.getTime() + 3 * 60 * 60 * 1000);

  // --- начало дня по Москве ---
  moscow.setHours(0, 0, 0, 0);
  const d = moscow;

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
