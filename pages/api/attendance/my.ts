import type { NextApiRequest, NextApiResponse } from "next";

import Attendance from "@/models/attendance-model";
import Contract from "@/models/contract-model";
import Group from "@/models/group-model";
import Student from "@/models/group-student-model";
import Lesson from "@/models/lesson-model";
import "@/models/subscription-model";
import { connectDB, getUserFromReq } from "@/helpers/helpers";

type LessonDetails = {
  id: string;
  date: string;
  groupTitle: string;
  present: boolean;
};

type PopulatedSubscription = {
  totalLessons?: number;
  usedLessons?: number;
};

const startOfUtcDay = (value: Date) =>
  new Date(
    Date.UTC(
      value.getUTCFullYear(),
      value.getUTCMonth(),
      value.getUTCDate(),
    ),
  );

const getJoinedAt = (
  student: any,
  groupId: string,
  firstJournalDate?: Date,
) => {
  const joinedDates = student.groupJoinedAt;
  const savedDate =
    joinedDates instanceof Map
      ? joinedDates.get(groupId)
      : joinedDates?.[groupId];

  // У старых учеников поле ещё отсутствует. Их createdAt — наиболее точная
  // доступная граница, потому что историческая дата вступления не сохранялась.
  if (savedDate) return new Date(savedDate);

  // В старом журнале запись создавалась для каждого ученика, включая
  // отсутствовавших. Поэтому первая такая запись точнее даты карточки.
  if (firstJournalDate) return firstJournalDate;

  const createdAt = new Date(student.createdAt);
  return Number.isNaN(createdAt.getTime())
    ? new Date(0)
    : startOfUtcDay(createdAt);
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
    .select(
      "_id fullName contract groupJoinedAt createdAt activeSubscription",
    )
    .populate({
      path: "activeSubscription",
      select: "totalLessons usedLessons",
    })
    .lean();

  if (!students.length) return res.status(200).json({ students: [] });

  const studentIds = students.map((student) => student._id);
  const groups = await Group.find({ students: { $in: studentIds } })
    .select("_id title students")
    .sort({ _id: 1 })
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
      })
        .select("lesson student present")
        .lean()
    : [];

  const presentKeys = new Set(
    attendances
      .filter((attendance) => attendance.present)
      .map((attendance) => `${attendance.student}:${attendance.lesson}`),
  );
  const lessonById = new Map(
    lessons.map((lesson) => [String(lesson._id), lesson]),
  );
  const firstJournalDateByMembership = new Map<string, Date>();

  attendances.forEach((attendance) => {
    const lesson = lessonById.get(String(attendance.lesson));
    if (!lesson) return;

    const key = `${attendance.student}:${lesson.group}`;
    const current = firstJournalDateByMembership.get(key);
    if (!current || lesson.date < current) {
      firstJournalDateByMembership.set(key, lesson.date);
    }
  });

  const result = students
    .map((student) => {
      const studentId = String(student._id);
      const studentGroups = groups.filter((group) =>
        group.students.some((id: unknown) => String(id) === studentId),
      );
      const joinedAtByGroup = new Map(
        studentGroups.map((group) => {
          const groupId = String(group._id);
          return [
            groupId,
            getJoinedAt(
              student,
              groupId,
              firstJournalDateByMembership.get(`${studentId}:${groupId}`),
            ),
          ] as const;
        }),
      );

      const details: LessonDetails[] = lessons
        .filter((lesson) => {
          const joinedAt = joinedAtByGroup.get(String(lesson.group));
          return Boolean(joinedAt && lesson.date >= joinedAt);
        })
        .map((lesson) => ({
          id: String(lesson._id),
          date: lesson.date.toISOString(),
          groupTitle: `Группа ${
            studentGroups.findIndex(
              (group) => String(group._id) === String(lesson.group),
            ) + 1
          }`,
          present: presentKeys.has(`${studentId}:${lesson._id}`),
        }));
      const presentCount = details.filter((lesson) => lesson.present).length;
      const missedCount = details.length - presentCount;
      const subscription = student.activeSubscription as
        | PopulatedSubscription
        | null
        | undefined;
      const remainingLessons = subscription
        ? Math.max(
            0,
            Number(subscription.totalLessons || 0) -
              Number(subscription.usedLessons || 0),
          )
        : 0;

      return {
        id: studentId,
        fullName: student.fullName,
        groups: studentGroups.map((group, index) => ({
          id: String(group._id),
          title: `Группа ${index + 1}`,
        })),
        percentage: details.length
          ? Math.round((presentCount / details.length) * 100)
          : 0,
        presentCount,
        missedCount,
        totalLessons: details.length,
        remainingLessons,
        hasActiveSubscription: Boolean(subscription && remainingLessons > 0),
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
