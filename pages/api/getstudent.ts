import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { env } from "process";
import { adminService } from "@/services/admin-service";
import { tokenService } from "@/services/token-service";
import { IUser } from "@/clientModels/IUser";

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
    const accessToken = req.headers["authorization"]?.split(" ")[1];
    if (accessToken) {
      const data = tokenService.validateAccessToken(accessToken!) as IUser;
      if (data?.email === "admin@admin") {
        const students = await adminService.getAllStudents();
        return res.status(200).json(students);
      } else return res.status(401).json({ massage: "ошибка токена" });
    }
    return res.status(400).json({ message: "ошибка доступа" });
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.json({ message: "чтото пошло не так" });
  }
}
