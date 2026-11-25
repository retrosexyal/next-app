import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB, requireAdmin } from "@/helpers/helpers";
import Student from "@/models/group-student-model";
import Group from "@/models/group-model";
import Lesson from "@/models/lesson-model";
import Attendance from "@/models/attendance-model";
import Subscription from "@/models/subscription-model";
import { isValidObjectId } from "mongoose";
import { studentAttendanceSummary } from "@/services/student-attendance-summary";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET" && req.method !== "PATCH") return res.status(405).end();
  if (!requireAdmin({ req, res })) return;
  if (req.method === "PATCH") {
    const { id, hidden } = req.body || {};
    if (typeof id !== "string" || !isValidObjectId(id) || typeof hidden !== "boolean") return res.status(400).json({ message: "Некорректные данные" });
    try {
      await connectDB();
      const student = await Student.findByIdAndUpdate(id, { $set: { hiddenFromAdminStudents: hidden } }, { new: true });
      if (!student) return res.status(404).json({ message: "Студент не найден" });
      return res.json({ id, hidden });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Не удалось изменить видимость" });
    }
  }
  const from = req.query.from;
  const studentId = req.query.studentId;
  if (studentId !== undefined && (typeof studentId !== "string" || !isValidObjectId(studentId))) return res.status(400).json({ message: "Некорректный студент" });
  let start: Date | undefined;
  if (from !== undefined) {
    if (typeof from !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(from)) return res.status(400).json({ message: "Некорректная дата" });
    start = new Date(`${from}T00:00:00+03:00`);
    if (!Number.isFinite(start.getTime()) || new Date(`${from}T00:00:00Z`).toISOString().slice(0, 10) !== from) return res.status(400).json({ message: "Некорректная дата" });
  }
  try {
    await connectDB();
    const [students, groups, lessons, marks, subscriptions] = await Promise.all([
      Student.find().select("fullName phone birthday isTemp groupJoinedAt activeSubscription lastPayment hiddenFromAdminStudents").lean(),
      Group.find().lean(), Lesson.find({ date: { $lte: new Date() } }).lean(),
      Attendance.find().select("student lesson present refunded").lean(), Subscription.find().lean(),
    ]);
    const byStudent = new Map<string, Map<string, any>>();
    for (const mark of marks as any[]) {
      const id = String(mark.student);
      if (!byStudent.has(id)) byStudent.set(id, new Map());
      byStudent.get(id)!.set(String(mark.lesson), mark);
    }
    const subs = new Map((subscriptions as any[]).map(s => [String(s._id), s]));
    const result = (students as any[]).filter(s => !studentId || String(s._id) === studentId).map(student => {
      const id = String(student._id);
      const membership = (groups as any[]).filter(g => g.students.some((s: any) => String(s) === id));
      const records = byStudent.get(id) || new Map<string, any>();
      const { eligible, attended } = studentAttendanceSummary(student, groups, lessons, records,
        typeof from === "string" ? from : "", new Date(Date.now() + 3 * 3600000).toISOString().slice(0, 10));
      const sub = subs.get(String(student.activeSubscription));
      return { id, fullName: student.fullName, phone: student.phone, groups: membership.map(g => g.title),
        hidden: Boolean(student.hiddenFromAdminStudents),
        ...(studentId ? { visits: eligible.map(l => {
          const mark = records?.get(String(l._id));
          return { id: String(l._id), date: new Date(new Date(l.date).getTime() + 3 * 3600000).toISOString().slice(0, 10),
            group: (groups as any[]).find(g => String(g._id) === String(l.group))?.title || "Удалённая группа",
            present: Boolean(mark?.present && !mark.refunded) };
        }).sort((a, b) => a.date.localeCompare(b.date)) } : {}),
        memberships: membership.map(g => ({ id: String(g._id), title: g.title, joinedAt: student.groupJoinedAt?.[String(g._id)] || null })),
        total: eligible.length, present: attended.length, percent: eligible.length ? Math.round(attended.length / eligible.length * 100) : null,
        lastVisit: attended.map(l => new Date(l.date).toISOString()).sort().pop() || null,
        subscription: sub ? { remaining: Math.max(0, sub.totalLessons - sub.usedLessons), total: sub.totalLessons,
          expired: !!sub.expiresAt && new Date(sub.expiresAt) < new Date() } : null };
    });
    if (studentId) return result.length ? res.json(result[0]) : res.status(404).json({ message: "Студент не найден" });
    res.json(result);
  } catch (error) { console.error(error); res.status(500).json({ message: "Не удалось загрузить студентов" }); }
}
