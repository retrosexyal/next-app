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
    const data = req.body;
    const accessToken = req.headers["authorization"]?.split(" ")[1];
    if (accessToken) {
      const token = tokenService.validateAccessToken(accessToken!) as IUser;
      if (token.email === "admin@admin") {
        const studentData = await adminService.addStudent(
          data.name,
          data.date,
          data.place,
          data.group
        );
        return res.status(200).json(studentData);
      } else res.status(401).json({ message: "you are not admin" });
    }
  } catch (error) {
    console.error(error);
    res.statusCode = 400;
    res.json({ message: "ошибка добавления студента" });
  }
}
