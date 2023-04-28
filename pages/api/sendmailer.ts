import { mailOptionsBirthday, transporter } from "@/config/nodemailer";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const now = new Date();
  const options = { timeZone: "Europe/Minsk" };
  const minskTime = now.toLocaleString("en-US", options);
  await transporter.sendMail({
    ...mailOptionsBirthday,
    subject: "Дни рождения сегодня",
    text: "zzz",
    html: `<h1>${minskTime}</h2>`,
  });
  res.status(200).json({ message: "письмо отправлено" });
}
