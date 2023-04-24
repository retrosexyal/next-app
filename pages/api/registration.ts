import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import mongoose from "mongoose";
import { userService } from "@/services/user-service";
import { env } from "process";

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
    const userData = await userService.registration(data.email, data.password);
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        httpOnly: true,
      })
    );
    return res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    res.statusCode = 400;
    res.json({ message: "ошибка регистрации" });
  }
}
