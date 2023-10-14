import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { env } from "process";
import UserModel from "@/models/user-model";

const DB = env.DB_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(DB!);
      console.log("bd ok");
    }
    const currentUrl = req.url;
    const activateLink = currentUrl?.split("/");
    const link = activateLink![activateLink!.length - 1];
    const canditate = await UserModel.findOne({ activationLink: link });
    canditate.isActivated = true;
    canditate.save();
    return res.status(200).redirect("/");
  } catch (error) {
    console.error(error);
    res.statusCode = 400;
    res.json({ message: "ошибка активации" });
  }
}
