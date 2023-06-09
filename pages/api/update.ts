import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { env } from "process";
import { adminService } from "@/services/admin-service";
import { tokenService } from "@/services/token-service";
import { IUser } from "@/clientModels/IUser";
import StudentModel from "@/models/student-model";
import userModel from "@/models/user-model";

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
    const user = await userModel.findOne({ email: "admin@admin" });
    console.log(user);
    user.name = "Елизавета";
    await user.save();
    res.status(200).json({ message: "студенты обновлены" });
    const data = req.body;
  } catch (error) {
    console.error(error);
    res.statusCode = 400;
    res.json({ message: "ошибка добавления студента" });
  }
}
