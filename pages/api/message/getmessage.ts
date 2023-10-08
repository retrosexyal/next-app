import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { env } from "process";
import { contractService } from "@/services/contract-service";
import { getUserInfo } from "@/helpers/helpers";
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
    const user = getUserInfo(req);
    if (user) {
      const message = await userService.getMessage(user.id);
      return res.status(200).json(message);
    }
    return res.status(400).json({ message: "пользователь не найден" });
  } catch (error) {
    console.error(error);
    res.statusCode = 401;
    res.json({ message: "ошибка создания" });
  }
}
