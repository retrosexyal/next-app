// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { mailOptions, transporter } from "../../config/nodemailer.js";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.body) {
    const data = JSON.parse(req.body);
    await transporter.sendMail({
      ...mailOptions,
      subject: "Анкета",
      text: "zzz",
      html: `<h1>${data.name}</h1><h2>${data.age}</h2><h2>${data.email}</h2>`,
    });
  }
  res.status(200).json(req.body);
}
