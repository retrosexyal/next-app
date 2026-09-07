import type { NextApiRequest, NextApiResponse } from "next";

import Attendance from "@/models/attendance-model";
import Contract from "@/models/contract-model";
import Group from "@/models/group-model";
import Student from "@/models/group-student-model";
import Lesson from "@/models/lesson-model";
import { connectDB, getUserFromReq } from "@/helpers/helpers";

type LessonDetails = {
  id: string;
  date: string;
  groupTitle: string;
  present: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") return res.status(405).end();

  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ message: "не авторизован" });

  await connectDB();

  const contracts = await Contract.find({
    user: user.id,
    isDone: true,
  })
    .select("_id")
    .lean();

  if (!contracts.length) return res.status(200).json({ students: [] });

  const students = await Student.find({
    contract: { $in: contracts.map((contract) => contract._id) },
  })
    .select("_id fullName contract")
    .lean();

  if (!students.length) return res.status(200).json({ students: [] });

  const studentIds = students.map((student) => student._id);
  const groups = await Group.find({ students: { $in: studentIds } })
    .select("_id title students")
    .lean();

  const groupIds = groups.map((group) => group._id);
  const lessons = groupIds.length
    ? await Lesson.find({
        group: { $in: groupIds },
        date: { $lte: new Date() },
      })
        .select("_id group date")
        .sort({ date: -1 })
        .lean()
    : [];

  const attendances = lessons.length
    ? await Attendance.find({
        lesson: { $in: lessons.map((lesson) => lesson._id) },
        student: { $in: studentIds },
        present: true,
      })
        .select("lesson student")
        .lean()
    : [];

  const presentKeys = new Set(
    attendances.map(
      (attendance) => `${attendance.student}:${attendance.lesson}`,
    ),
  );
  const groupById = new Map(
    groups.map((group) => [String(group._id), group]),
  );

  const result = students
    .map((student) => {
      const studentId = String(student._id);
      const studentGroupIds = new Set(
        groups
          .filter((group) =>
            group.students.some((id: unknown) => String(id) === studentId),
          )
          .map((group) => String(group._id)),
      );

      const details: LessonDetails[] = lessons
        .filter((lesson) => studentGroupIds.has(String(lesson.group)))
        .map((lesson) => ({
          id: String(lesson._id),
          date: lesson.date.toISOString(),
          groupTitle:
            groupById.get(String(lesson.group))?.title || "Группа",
          present: presentKeys.has(`${studentId}:${lesson._id}`),
        }));
      const presentCount = details.filter((lesson) => lesson.present).length;

      return {
        id: studentId,
        fullName: student.fullName,
        percentage: details.length
          ? Math.round((presentCount / details.length) * 100)
          : 0,
        presentCount,
        totalLessons: details.length,
        lessons: details,
      };
    })
    .sort((a, b) =>
      String(a.fullName).localeCompare(String(b.fullName), "ru", {
        sensitivity: "base",
      }),
    );

  return res.status(200).json({ students: result });
}
