import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB, requireAdmin } from "@/helpers/helpers";

const pad2 = (n: number) => String(n).padStart(2, "0");
const toYYYYMMDD = (d: Date) =>
  `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}`;

const normPhone = (v: string) => (v || "").replace(/\D/g, "");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const admin = requireAdmin({ req, res });
  if (!admin) return;

  if (req.method !== "GET") return res.status(405).end();

  // Москва (UTC+3) как “источник времени”
  const nowUtc = new Date();
  const mskNow = new Date(nowUtc.getTime() + 3 * 60 * 60 * 1000);

  const toDate = new Date(mskNow);
  const fromDate = new Date(mskNow);
  fromDate.setDate(fromDate.getDate() - 30);

  const from = toYYYYMMDD(fromDate);
  const to = toYYYYMMDD(toDate);

  // ВАЖНО: корректный base url (чтобы работало в деплое)
  const base =
    (req.headers.origin as string) ||
    `${req.headers["x-forwarded-proto"] || "https"}://${req.headers.host}`;

  // Ходим в твой /api/payments/express (там кэш и token ERIP)
  const r = await fetch(`${base}/api/payments/express?from=${from}&to=${to}`, {
    headers: { Authorization: req.headers.authorization || "" },
  });

  const data = await r.json();
  const items = Array.isArray(data) ? data : data.Payments || data.Items || [];

  // Приводим к удобному формату для UI
  const mapped = items.map((p: any) => ({
    paymentNo: String(p.PaymentNo ?? ""),
    amount: p.Amount ?? null,
    phone: normPhone(p.AccountNo ?? ""), // как приходит от Express
    surname: p.Surname ?? "",
    firstName: p.FirstName ?? "",
    // Created у тебя выглядит как YYYYMMDD... поэтому режем
    date: p.Created
      ? new Date(
          `${p.Created.slice(0, 4)}-${p.Created.slice(4, 6)}-${p.Created.slice(6, 8)}T00:00:00.000Z`,
        ).toISOString()
      : null,
    rawCreated: p.Created ?? null,
  }));

  // часто полезно убрать пустые
  res.json({
    from,
    to,
    count: mapped.length,
    items: mapped,
  });
}
