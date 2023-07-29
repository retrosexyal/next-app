import { mailOptionsBirthday, transporter } from "@/config/nodemailer";
import { adminService } from "@/services/admin-service";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { env } from "process";
import { IInfo } from "@/interface/iContact";

const DB = env.DB_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(DB!);
    }
  } catch (error) {
    console.error(error);
  }
  const { info }: { info: IInfo } = req.body;
  const { FIOP, place, phone, dateB } = info;

  await transporter.sendMail({
    ...mailOptionsBirthday,
    subject: "Запись на занятия",
    text: "zzz",
    html: `<div>
      <h3>Имя:${FIOP}</h3>
      <h3>Место занятия:${place}</h3>
      <h3>Телефон:${phone}</h3>
      <h3>Лет ребёнку:${dateB}</h3>
    </div>`,
  });
  res.status(200).json({ message: "письмо отправлено" });
}
