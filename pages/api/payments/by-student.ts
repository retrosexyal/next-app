import Payment from "@/models/payment-model";
import { connectDB, requireTeacher } from "@/helpers/helpers";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await connectDB();
  const user = requireTeacher({ req, res });
  if (!user) return;

  const { id } = req.query;
  const payments = await Payment.find({ student: id }).sort({ date: -1 });

  res.json(payments);
}
