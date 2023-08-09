import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { env } from "process";
import UserModel from "@/models/user-model";
import bcrypt from "bcrypt";

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
    try {
      const currentUrl = req.url;
      const activateLink = currentUrl?.split("/");
      const link = activateLink![activateLink!.length - 1];
      const candidate = await UserModel.findOne({ activationLink: link });
      const hashPassword = await bcrypt.hash(link.split("-")[0], 7);
      candidate.password = hashPassword;
      await candidate.save();
    } catch (e) {
      console.log(e);
    }
    return res.status(200).redirect("/password/change");
  } catch (error) {
    console.error(error);
    res.statusCode = 400;
    res.json({ message: "ошибка активации" });
  }
}
