import type { ClientSession } from "mongoose";
import Attendance from "@/models/attendance-model";
import Lesson from "@/models/lesson-model";

export function canRetireSubscription(sub: any) {
  return Number(sub.usedLessons || 0) >= Number(sub.totalLessons || 0) &&
    (!sub.autoMissCompensation || Boolean(sub.compensationLesson));
}

// Вызывается внутри транзакции. Посещение текущего урока ещё не известно;
// учитываем только предыдущий списанный урок с более ранней датой.
export async function consumeSubscriptionLesson(sub: any, lesson: any, session: ClientSession) {
  const checkMiss = sub.autoMissCompensation && !sub.compensationLesson;
  const previousLesson = checkMiss && sub.lastChargedLesson
    ? await Lesson.findById(sub.lastChargedLesson).session(session) : null;
  if (checkMiss) {
    if (previousLesson && previousLesson.date < lesson.date) {
      const previousAttendance = await Attendance.findOne({
        lesson: previousLesson._id, student: sub.student,
        chargedSubscription: sub._id, consumed: true,
      }).session(session);
      if (previousAttendance && !previousAttendance.present) {
        sub.compensatedMissedLesson = previousLesson._id;
        sub.compensationLesson = lesson._id;
        await sub.save({ session });
        return "compensation" as const;
      }
    }
  }
  if (sub.usedLessons >= sub.totalLessons) return null;
  sub.usedLessons += 1;
  if (checkMiss) {
    // Задняя дата не должна заменить последнее хронологическое списание.
    if (!previousLesson || previousLesson.date <= lesson.date) sub.lastChargedLesson = lesson._id;
  }
  await sub.save({ session });
  return "charged" as const;
}
