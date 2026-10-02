// pages/api/payments/sync-group.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectDB, requireTeacher, requireGroupAccess } from "@/helpers/helpers";
import Group from "@/models/group-model";
import GroupStudent from "@/models/group-student-model";
import Payment from "@/models/payment-model";
import Subscription from "@/models/subscription-model";
import mongoose from "mongoose";

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
  const user = await requireTeacher({ req, res });
  if (!user) return;

  const { groupId, from, to } = req.body || {};
  if (!groupId) return res.status(400).json("groupId обязателен");

  const group = await Group.findById(groupId).populate("students");
  if (!group) return res.status(404).end();
  if (!await requireGroupAccess(String(group._id), user, res)) return;

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
  const students = ((group.students as any[]) || []).filter(Boolean);

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

  // Каждая новая оплата и её начисление фиксируются вместе. Старые платежи
  // не переобрабатываются: это не миграция существующих остатков.
  for (const payment of payments) {
    const externalId = String(payment.PaymentNo || "").trim();
    if (!externalId) continue;
    const student = byPhone.get(phoneSuffix7(payment.AccountNo || "")) ||
      byName.get(`${(payment.Surname || "").toLowerCase().trim()}|${(payment.FirstName || "").toLowerCase().trim()}`);
    if (!student) continue;
    const amount = parseAmount(payment.Amount);
    const date = parseExpressDate(payment.Created);
    const isSub = isSubscriptionPayment(amount);
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        if (await Payment.exists({ externalId }).session(session)) return;
        const currentStudent = await GroupStudent.findById(student._id).session(session);
        if (!currentStudent) throw new Error("Ученик не найден");
        await Payment.create([{
          student: student._id, externalId, type: isSub ? "subscription" : "single",
          lessonsCount: isSub ? 8 : 1, amount, date,
        }], { session });
        if (isSub) {
          let sub = currentStudent.activeSubscription
            ? await Subscription.findOne({ _id: currentStudent.activeSubscription, student: student._id }).session(session)
            : null;
          if (sub && sub.usedLessons < sub.totalLessons) {
            sub.totalLessons += 8;
            await sub.save({ session });
          } else {
            [sub] = await Subscription.create([{ student: student._id, totalLessons: 8, usedLessons: 0 }], { session });
            currentStudent.activeSubscription = sub._id;
          }
        }
        if (!currentStudent.lastPayment?.date || new Date(currentStudent.lastPayment.date) < date) {
          currentStudent.lastPayment = {
            amount, date, type: isSub ? "subscription" : "single", externalId,
          };
        }
        currentStudent.paymentsSyncedAt = new Date();
        await currentStudent.save({ session });
      });
    } catch (error: any) {
      // Проигравший конкурентный запрос ничего не начисляет.
      if (error?.code !== 11000 || !await Payment.exists({ externalId })) {
        console.error("payment sync error:", error);
        return res.status(500).json({ message: "Синхронизация прервана. Повторите запрос: обработанные оплаты не начислятся повторно." });
      }
    } finally { await session.endSession(); }
  }
  return res.json(await GroupStudent.find({ _id: { $in: students.map((student) => student._id) } }).populate("activeSubscription"));
}
