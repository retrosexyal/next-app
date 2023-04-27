import cron from "node-cron";
import { transporter, mailOptionsBirthday } from "./config/nodemailer";

console.log("скрипт запущен");

cron.schedule(
  "20 19 * * *",
  async () => {
    await transporter.sendMail({
      ...mailOptionsBirthday,
      subject: "Анкета",
      text: "zzz",
      html: `<h1>авто</h1><h2>авто</h2><h2>авто</h2>`,
    });
    console.log("письмо отправлено");
  },
  {
    scheduled: true,
    timezone: "Europe/Moscow",
  }
);
