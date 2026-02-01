import { NextApiRequest, NextApiResponse } from "next";
import { connectDB, requireTeacher } from "@/helpers/helpers";
import Group from "@/models/group-model";
import GroupStudent from "@/models/group-student-model";
import Payment from "@/models/payment-model";
import Subscription from "@/models/subscription-model";
import { Types } from "mongoose";

const norm = (v: string) => v.replace(/\D/g, "");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await connectDB();
  const user = requireTeacher({ req, res });
  if (!user) return;

  const { groupId, from, to } = req.body;

  const group = await Group.findById(groupId).populate("students");
  if (!group) return res.status(404).end();

  // тянем express
  const r = await fetch(
    `${process.env.URL}/api/payments/express?from=${from}&to=${to}`,
    { headers: { Authorization: req.headers.authorization! } },
  );
  const data = await r.json();
  const payments = Array.isArray(data)
    ? data
    : data.Payments || data.Items || [];

  // for (const s of group.students as any[]) {
  //   const [surname, name] = s.fullName.split(" ");

  //   const phoneNorm = norm(s.phone || "").slice(-7);

  //   const matches = payments.filter((p: any) => {
  //     const acc = norm(p.AccountNo || "").slice(-7);

  //     const phoneOk = acc === phoneNorm;

  //     const nameOk =
  //       p.Surname?.toLowerCase() === surname.toLowerCase() &&
  //       p.FirstName?.toLowerCase() === name.toLowerCase();

  //     return phoneOk || nameOk;
  //   });

  //   /* toDo отображать если нет оплаты на текущий момент, список предыдущих оплат, хранить в бд оплаты чтобы постоянно не идти к апи */

  //   for (const p of matches) {
  //     const exists = await Payment.findOne({ externalId: p.PaymentNo });
  //     if (exists) continue;

  //     const raw = p.Amount.replace(",", ".").trim();
  //     const amount = Number(raw);

  //     const isSub = amount >= 80;

  //     await Payment.create({
  //       student: s._id,
  //       externalId: p.PaymentNo,
  //       type: isSub ? "subscription" : "single",
  //       lessonsCount: isSub ? 7 : 1,
  //       amount,
  //       date: new Date(
  //         p.Created.slice(0, 4) +
  //           "-" +
  //           p.Created.slice(4, 6) +
  //           "-" +
  //           p.Created.slice(6, 8),
  //       ),
  //     });

  //     await GroupStudent.updateOne(
  //       { _id: new Types.ObjectId(s._id) },
  //       {
  //         $set: {
  //           lastPayment: {
  //             amount,
  //             date: new Date(
  //               p.Created.slice(0, 4) +
  //                 "-" +
  //                 p.Created.slice(4, 6) +
  //                 "-" +
  //                 p.Created.slice(6, 8),
  //             ),
  //             type: isSub ? "subscription" : "single",
  //             externalId: p.PaymentNo,
  //           },
  //           paymentsSyncedAt: new Date(),
  //         },
  //       },
  //     );

  //     if (isSub) {
  //       let sub = await Subscription.findOne({ student: s._id });

  //       if (!sub) {
  //         sub = await Subscription.create({
  //           student: s._id,
  //           totalLessons: 8,
  //           usedLessons: 0,
  //         });

  //         await GroupStudent.findByIdAndUpdate(s._id, {
  //           activeSubscription: sub._id,
  //         });
  //       } else {
  //         sub.totalLessons += 8;
  //         await sub.save();
  //       }
  //     }
  //   }
  // }

  // отдаём с подписками

  for (const p of payments) {
    const acc = norm(p.AccountNo || "").slice(-7);

    const student = (group.students as any[]).find((s) => {
      const phoneNorm = norm(s.phone || "").slice(-7);
      const [surname, name] = s.fullName.split(" ");

      const phoneOk = acc === phoneNorm;

      const nameOk =
        p.Surname?.toLowerCase() === surname?.toLowerCase() &&
        p.FirstName?.toLowerCase() === name?.toLowerCase();

      return phoneOk || nameOk;
    });

    if (!student) continue;

    const exists = await Payment.findOne({ externalId: p.PaymentNo });
    if (exists) continue;

    const raw = p.Amount.replace(",", ".").trim();
    const amount = Number(raw);
    const isSub = amount >= 80;

    const date = new Date(
      p.Created.slice(0, 4) +
        "-" +
        p.Created.slice(4, 6) +
        "-" +
        p.Created.slice(6, 8),
    );

    await Payment.create({
      student: student._id,
      externalId: p.PaymentNo,
      type: isSub ? "subscription" : "single",
      lessonsCount: isSub ? 7 : 1,
      amount,
      date,
    });

    await GroupStudent.updateOne(
      { _id: student._id },
      {
        $set: {
          lastPayment: {
            amount,
            date,
            type: isSub ? "subscription" : "single",
            externalId: p.PaymentNo,
          },
          paymentsSyncedAt: new Date(),
        },
      },
    );

    if (isSub) {
      let sub = await Subscription.findOne({ student: student._id });
      if (!sub) {
        sub = await Subscription.create({
          student: student._id,
          totalLessons: 8,
          usedLessons: 0,
        });
        await GroupStudent.findByIdAndUpdate(student._id, {
          activeSubscription: sub._id,
        });
      } else {
        sub.totalLessons += 8;
        await sub.save();
      }
    }
  }

  const students = await GroupStudent.find({
    _id: { $in: group.students },
  }).populate("activeSubscription");

  res.json(students);
}
