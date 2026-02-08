// pages/api/payments/sync-group.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectDB, requireTeacher } from "@/helpers/helpers";
import Group from "@/models/group-model";
import GroupStudent from "@/models/group-student-model";
import Payment from "@/models/payment-model";
import Subscription from "@/models/subscription-model";
import { Types } from "mongoose";

const normDigits = (v: string) => (v || "").replace(/\D/g, "");
const phoneSuffix7 = (v: string) => normDigits(v).slice(-7);

type ExpressPayment = {
  PaymentNo: string; // external id
  Amount: string; // "84,00"
  Created: string; // "YYYYMMDD..." (по твоему коду)
  AccountNo?: string;
  Surname?: string;
  FirstName?: string;
};

function parseAmount(v: string): number {
  const raw = String(v || "").replace(",", ".").trim();
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

function parseExpressDate(created: string): Date {
  // ожидаем YYYYMMDD...
  const y = created?.slice(0, 4);
  const m = created?.slice(4, 6);
  const d = created?.slice(6, 8);
  const iso = `${y}-${m}-${d}`;
  const dt = new Date(iso);
  return Number.isFinite(dt.getTime()) ? dt : new Date();
}

function isSubscriptionPayment(amount: number) {
  // твоя логика: >=80 => subscription
  return amount >= 80;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const user = requireTeacher({ req, res });
  if (!user) return;

  const { groupId, from, to } = req.body || {};
  if (!groupId) return res.status(400).json("groupId обязателен");

  const group = await Group.findById(groupId).populate("students");
  if (!group) return res.status(404).end();

  // 1) тянем платежи из express-прокси
  const r = await fetch(
    `${process.env.URL}/api/payments/express?from=${from}&to=${to}`,
    { headers: { Authorization: req.headers.authorization! } },
  );

  if (!r.ok) {
    const t = await r.text().catch(() => "");
    return res.status(502).json(`express error: ${r.status} ${t}`);
  }

  const data = await r.json();
  const payments: ExpressPayment[] = Array.isArray(data)
    ? data
    : data?.Payments || data?.Items || [];

  // 2) строим быстрые индексы студентов группы
  const students = (group.students as any[]) || [];

  const byPhone = new Map<string, any>(); // suffix7 -> student
  const byName = new Map<string, any>();  // "surname|name" -> student

  for (const s of students) {
    const phoneKey = phoneSuffix7(s.phone || "");
    if (phoneKey) byPhone.set(phoneKey, s);

    const [surnameRaw, nameRaw] = String(s.fullName || "").split(" ");
    const surname = (surnameRaw || "").toLowerCase().trim();
    const name = (nameRaw || "").toLowerCase().trim();
    const nameKey = `${surname}|${name}`;
    if (surname && name) byName.set(nameKey, s);
  }

  // 3) заранее вытаскиваем уже существующие externalId
  const externalIds = payments
    .map((p) => String(p.PaymentNo || "").trim())
    .filter(Boolean);

  const existing = await Payment.find({ externalId: { $in: externalIds } })
    .select({ externalId: 1 })
    .lean();

  const existingSet = new Set(existing.map((x) => String(x.externalId)));

  // 4) подготавливаем новые платежи + агрегаты для обновлений
  const newPaymentDocs: any[] = [];

  // lastPaymentCandidates: studentId -> {amount,date,type,externalId}
  const lastPaymentCandidates = new Map<
    string,
    { amount: number; date: Date; type: "single" | "subscription"; externalId: string }
  >();

  // subscriptionAdds: studentId -> totalLessonsToAdd (например +8 за каждый абонементный платеж)
  const subscriptionAdds = new Map<string, number>();

  for (const p of payments) {
    const externalId = String(p.PaymentNo || "").trim();
    if (!externalId) continue;
    if (existingSet.has(externalId)) continue;

    const accKey = phoneSuffix7(p.AccountNo || "");
    const studentByPhone = accKey ? byPhone.get(accKey) : null;

    const surname = (p.Surname || "").toLowerCase().trim();
    const name = (p.FirstName || "").toLowerCase().trim();
    const nameKey = `${surname}|${name}`;
    const studentByName = surname && name ? byName.get(nameKey) : null;

    const student = studentByPhone || studentByName;
    if (!student) continue;

    const amount = parseAmount(p.Amount);
    const isSub = isSubscriptionPayment(amount);

    const date = parseExpressDate(p.Created);

    newPaymentDocs.push({
      student: new Types.ObjectId(student._id),
      externalId,
      type: isSub ? "subscription" : "single",
      lessonsCount: isSub ? 7 : 1,
      amount,
      date,
    });

    // candidate for lastPayment (берём самый новый по дате)
    const sid = String(student._id);
    const prev = lastPaymentCandidates.get(sid);
    if (!prev || prev.date < date) {
      lastPaymentCandidates.set(sid, {
        amount,
        date,
        type: isSub ? "subscription" : "single",
        externalId,
      });
    }

    // subscription adds
    if (isSub) {
      subscriptionAdds.set(sid, (subscriptionAdds.get(sid) || 0) + 8);
    }
  }

  // 5) сохраняем новые платежи
  if (newPaymentDocs.length) {
    try {
      await Payment.insertMany(newPaymentDocs, { ordered: false });
    } catch (e) {
      // если где-то гонка по unique externalId — insertMany может ругнуться на часть,
      // но остальные вставит при ordered:false
      console.error("Payment.insertMany error:", e);
    }
  }

  // 6) обновляем lastPayment (только если новее)
  if (lastPaymentCandidates.size) {
    const ops = Array.from(lastPaymentCandidates.entries()).map(([studentId, lp]) => ({
      updateOne: {
        filter: {
          _id: new Types.ObjectId(studentId),
          $or: [
            { "lastPayment.date": { $exists: false } },
            { "lastPayment.date": { $lt: lp.date } },
          ],
        },
        update: {
          $set: {
            lastPayment: {
              amount: lp.amount,
              date: lp.date,
              type: lp.type,
              externalId: lp.externalId,
            },
            paymentsSyncedAt: new Date(),
          },
        },
      },
    }));

    await GroupStudent.bulkWrite(ops, { ordered: false });
  } else {
    // хотя бы отметим время синка студентам группы
    await GroupStudent.updateMany(
      { _id: { $in: students.map((s) => s._id) } },
      { $set: { paymentsSyncedAt: new Date() } },
    );
  }

  // 7) абонементы: upsert + inc totalLessons
  const subStudentIds = Array.from(subscriptionAdds.keys());
  if (subStudentIds.length) {
    const subOps = subStudentIds.map((sid) => ({
      updateOne: {
        filter: { student: new Types.ObjectId(sid) },
        update: {
          $inc: { totalLessons: subscriptionAdds.get(sid)! },
          $setOnInsert: {
            student: new Types.ObjectId(sid),
            usedLessons: 0,
            // expiresAt: можно добавить если нужно
          },
        },
        upsert: true,
      },
    }));

    await Subscription.bulkWrite(subOps, { ordered: false });

    // 8) проставляем activeSubscription студентам (после upsert знаем _id только через find)
    const subs = await Subscription.find({
      student: { $in: subStudentIds.map((id) => new Types.ObjectId(id)) },
    })
      .select({ _id: 1, student: 1 })
      .lean();

    const setSubOps = subs.map((s) => ({
      updateOne: {
        filter: { _id: s.student },
        update: { $set: { activeSubscription: s._id } },
      },
    }));

    await GroupStudent.bulkWrite(setSubOps, { ordered: false });
  }

  // 9) отдаём студентов группы с подпиской
  const result = await GroupStudent.find({ _id: { $in: students.map((s) => s._id) } })
    .populate("activeSubscription");

  return res.json(result);
}
