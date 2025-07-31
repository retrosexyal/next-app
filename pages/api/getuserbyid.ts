import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { env } from "process";
import { checkAdmin, getUserInfo } from "@/helpers/helpers";
import { userService } from "@/services/user-service";

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
    const data = req.body;
    if (checkAdmin(req)) {
      const userData = await userService.getUser(data.id);
      return res.status(200).json(userData);
    }

    return res.status(400).json({ message: "ошибка доступа" });
  } catch (error) {
    console.error(error);
    res.statusCode = 401;
    res.json({ message: "ошибка получения юзера" });
  }
}
