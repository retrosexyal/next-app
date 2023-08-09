import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { env } from "process";
import { adminService } from "@/services/admin-service";
import { tokenService } from "@/services/token-service";
import { IUser } from "@/clientModels/IUser";
import StudentModel from "@/models/student-model";
import userModel from "@/models/user-model";
import shablonModel from "@/models/shablon-model";
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
    /* const user = await userModel.findOne({ email: "admin@admin" }); */
    /* await shablonModel.create({ number: 1 }); */
    /*  console.log(user); */
    /* const hashPassword = await bcrypt.hash("", 7); */
    /* user.password = hashPassword; */
    /* user.isActivated = true; */
    /* await user.save(); */
    /* res.status(200).json({ message: "обновлено" }); */
  } catch (error) {
    console.error(error);
    res.statusCode = 400;
    res.json({ message: "ошибка добавления студента" });
  }
}
//$2b$07$VibPkEYNTs0q0LeV1JfmceX7.G2HLI96bG19b/mg2TWIu6XoucST2
//
