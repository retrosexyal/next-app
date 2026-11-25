import Lesson from "@/models/lesson-model";
import Attendance from "@/models/attendance-model";

export async function groupAttendanceOverview(group: any) {
  const today = new Date(new Date(Date.now() + 3 * 3600000).toISOString().slice(0, 10));
  const year = today.getUTCFullYear() - (today.getUTCMonth() < 8 ? 1 : 0);
  const lessons = await Lesson.find({ group: group._id, date: { $gte: new Date(Date.UTC(year, 8, 1)), $lte: today } }).select("_id date").sort({ date: 1 }).lean();
  const marks = await Attendance.find({ lesson: { $in: lessons.map(l => l._id) }, student: { $in: group.students.map((s: any) => s._id) } }).select("student lesson present refunded").lean();
  const present = new Set(marks.filter(m => m.present && !m.refunded).map(m => `${m.student}:${m.lesson}`));
  return Object.fromEntries(group.students.filter(Boolean).map((student: any) => {
    const details = lessons.map(l => ({ date: new Date(l.date).toISOString(), present: present.has(`${student._id}:${l._id}`) }));
    const count = details.filter(l => l.present).length;
    return [String(student._id), { percentage: details.length ? Math.round(count / details.length * 100) : null, lowAttendance: details.length > 0 && count / details.length < 0.4, lessons: details }];
  }));
}
