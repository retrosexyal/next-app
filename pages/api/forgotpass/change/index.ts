import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { env } from "process";
import { userService } from "@/services/user-service";
import cookie from "cookie";

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
    const { email, password, newPassword } = req.body;
    try {
      const userData = await userService.changePass(
        email,
        password,
        newPassword
      );
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("refreshToken", userData.refreshToken, {
          maxAge: 30 * 60 * 24 * 60,
          path: "/",
          httpOnly: true,
        })
      );
    } catch (e) {
      console.log(e);
    }
    return res.status(200).json({ message: "готово" });
  } catch (error) {
    console.error(error);
    res.statusCode = 400;
    res.json({ message: "ошибка активации" });
  }
}
