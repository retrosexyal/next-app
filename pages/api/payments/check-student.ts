import { requireTeacher } from "@/helpers/helpers";
import type { NextApiRequest, NextApiResponse } from "next";
import GroupStudent from "@/models/group-student-model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const user = requireTeacher({ req, res });
  if (!user) return;

  const { phone, fullName, studentId } = req.body;
  if (!studentId) return res.status(400).json("studentId обязателен");

  const to = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 2);

  const from = fromDate.toISOString().slice(0, 10).replace(/-/g, "");

  const r = await fetch(
    `${process.env.URL}/api/payments/express?from=${from}&to=${to}`,
    { headers: { Authorization: req.headers.authorization! } },
  );

  const data = await r.json();
  const all = Array.isArray(data) ? data : data.Payments || data.Items || [];

  const norm = (v: string) => v.replace(/\D/g, "");
  const phoneNorm = norm(phone).slice(-7);

  const filtered = all.filter((p: any) => {
    const acc = norm(p.AccountNo || "").slice(-7);

    return (
      phoneNorm === acc ||
      fullName.trim().toLowerCase().includes(p.Surname?.trim().toLowerCase())
    );
  });

  if (filtered.length) {
    const last = filtered.sort((a: any, b: any) =>
      b.Created.localeCompare(a.Created),
    )[0];

    await GroupStudent.findByIdAndUpdate(studentId, {
      lastPayment: {
        amount: parseFloat(last.Amount.replace(",", ".")),
        date: new Date(
          last.Created.slice(0, 4) +
            "-" +
            last.Created.slice(4, 6) +
            "-" +
            last.Created.slice(6, 8),
        ),
        type:
          parseFloat(last.Amount.replace(",", ".")) === 84
            ? "subscription"
            : "single",
        externalId: last.PaymentNo,
      },
      paymentsSyncedAt: new Date(),
    });
  }

  res.json(filtered);
}
