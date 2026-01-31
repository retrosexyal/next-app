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

  const lesson = await Lesson.findById(lessonId);
  if (!lesson) return res.status(404).end();

  const group = await Group.findById(lesson.group).populate("students");
  if (!group) return res.status(404).end();

  const attendances = await Attendance.find({ lesson: lessonId }).populate({
    path: "student",
    select: "fullName lastPayment",
  });

  const map = new Map(attendances.map((a) => [a.student._id.toString(), a]));

  const rows = (group.students as any[]).map((s) => {
    const a = map.get(s._id.toString());

    return {
      _id: s._id,
      student: a?.student || s,
      present: a ? a.present : false,
      source: a?.source || "free",
    };
  });

  res.json(rows);
}
