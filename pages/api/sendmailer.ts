import { mailOptionsBirthday, transporter } from "@/config/nodemailer";
import { NextApiRequest, NextApiResponse } from "next";

console.log("скрипт запущен");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await transporter.sendMail({
    ...mailOptionsBirthday,
    subject: "Анкета",
    text: "zzz",
    html: `<h1>авто</h1><h2>авто</h2><h2>авто</h2>`,
  });
  console.log("письмо отправлено");
  res.status(200).json({ message: "письмо отправлено" });
}
