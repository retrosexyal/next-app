import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { env } from "process";
import UserModel from "@/models/user-model";

const DB = env.DB_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(DB!);
      console.log("bd ok");
    }
    const { link } = req.query;
    if (typeof link !== "string" || !link) return res.status(400).json({ message: "Некорректная ссылка" });
    const user = await UserModel.findOneAndUpdate(
      { activationLink: link }, { $set: { isActivated: true } }, { new: true },
    );
    if (!user) return res.status(400).json({ message: "Некорректная ссылка" });
    return res.redirect(303, "/activation");
  } catch (error) {
    console.error(error);
    res.statusCode = 400;
    res.json({ message: "ошибка активации" });
  }
}
