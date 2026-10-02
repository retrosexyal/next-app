import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/helpers/helpers";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  if (!requireAdmin({ req, res })) return;
  return res.status(409).json({ message: "Измените остаток или создайте новый абонемент в админском журнале." });
}
