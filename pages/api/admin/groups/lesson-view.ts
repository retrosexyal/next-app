import { NextApiRequest, NextApiResponse } from "next";
import { connectDB, requireAdmin } from "@/helpers/helpers";
import Attendance from "@/models/attendance-model";
import Lesson from "@/models/lesson-model";
import Group from "@/models/group-model";
import "@/models/group-student-model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await connectDB();
  const admin = requireAdmin({ req, res });
  if (!admin) return;

  const { lessonId } = req.query;
  if (!lessonId) return res.status(400).json("lessonId обязателен");

  const lesson = await Lesson.findById(lessonId);
  if (!lesson) return res.status(404).end();

  const group = await Group.findById(lesson.group).populate("students");
  if (!group) return res.status(404).end();

  // берём посещаемость С оплатами
  const attendances = await Attendance.find({ lesson: lessonId })
    .populate({
      path: "student",
      select: "fullName",
    })
    .lean();

  const attendanceMap = new Map(
    attendances.map((a: any) => [String(a.student._id), a]),
  );

  const rows = (group.students as any[]).map((s) => {
    const a = attendanceMap.get(String(s._id));

    return {
      _id: s._id,
      student: {
        _id: s._id,
        fullName: s.fullName,
      },

      present: a?.present ?? false,
      source: a?.source ?? "free",

      // ✅ ВОТ ГЛАВНОЕ
      payment: a?.payment || {
        type: "free",
        amount: 0,
        date: lesson.date,
      },

      consumed: a?.consumed ?? false,
    };
  });

  res.json({
    lesson: {
      _id: lesson._id,
      date: lesson.date,
    },
    rows,
  });
}
