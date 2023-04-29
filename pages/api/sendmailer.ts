import { mailOptionsBirthday, transporter } from "@/config/nodemailer";
import { adminService } from "@/services/admin-service";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { env } from "process";

const DB = env.DB_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const now = new Date();
  const options = { timeZone: "Europe/Minsk" };
  const minskTime = now.toLocaleString("en-US", options);
  const date = new Date(minskTime);
  const yearToday = date.getFullYear();
  const monthToday = date.getMonth() + 1;
  const dayToday = date.getDate();
  let students;
  let bithStudents = "";

  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(DB!);
    }
    students = await adminService.getAllStudents();
  } catch (error) {
    console.error(error);
  }

  students?.forEach((student) => {
    const splited = student.date.split(".");
    const day = splited[0];
    const month = splited[1];
    if (+day === +dayToday && +month === +monthToday) {
      bithStudents += student.name + " ";
    }
  });

  await transporter.sendMail({
    ...mailOptionsBirthday,
    subject: "Дни рождения сегодня",
    text: "zzz",
    html: `<h1>${
      bithStudents
        ? `нужно поздравить:${bithStudents}`
        : "сегодня ниукого нет ДР"
    }</h2>`,
  });
  res.status(200).json({ message: "письмо отправлено" });
}
