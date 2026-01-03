/* import cron from "node-cron";
import { transporter, mailOptionsBirthday } from "./config/nodemailer.js";

console.log("скрипт запущен");
transporter.sendMail({
  ...mailOptionsBirthday,
  subject: "Анкета",
  text: "zzz",
  html: `<h1>авто</h1><h2>авто</h2><h2>авто</h2>`,
});

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
); */

import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  }).listen(port)

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})
/* $env:NODE_OPTIONS="--dns-result-order=ipv4first"  */