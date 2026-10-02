import type { NextApiRequest, NextApiResponse } from "next";
import { requireTeacher } from "@/helpers/helpers";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  if (!await requireTeacher({ req, res })) return;
  return res.status(409).json({ message: "Используйте отметку оплаты в журнале. Отдельное списание отключено." });
}
