import { requireTeacher, connectDB } from "@/helpers/helpers";
import type { NextApiRequest, NextApiResponse } from "next";
import ExpressCache from "@/models/express-cache-model";

const BASE = "https://api.express-pay.by/v1/payments";
const TTL = 10 * 60 * 1000; // 10 минут

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await connectDB();

  const user = requireTeacher({ req, res });
  if (!user) return;

  const { from, to } = req.query;
  if (!from) return res.status(400).json("from обязателен");

  const key = `payments_${from}_${to || ""}`;

  // 1) пробуем кэш
  const cached = await ExpressCache.findOne({ key });


  if (cached && Date.now() - cached.updatedAt.getTime() < TTL) {
    return res.json(cached.data);
  }


  // 2) если нет — идём в Express
  const url = `${BASE}?token=${process.env.ERIP}&from=${from}&to=${to}`;
  const r = await fetch(url);
  const data = await r.json();

  // 3) сохраняем / обновляем
  await ExpressCache.updateOne(
    { key },
    { $set: { data, updatedAt: new Date() } },
    { upsert: true },
  );

  res.json(data);
}
