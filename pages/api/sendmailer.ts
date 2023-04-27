import { mailOptionsBirthday, transporter } from "@/config/nodemailer";

console.log("скрипт запущен");

transporter.sendMail({
  ...mailOptionsBirthday,
  subject: "Анкета",
  text: "zzz",
  html: `<h1>авто</h1><h2>авто</h2><h2>авто</h2>`,
});
console.log("письмо отправлено");
