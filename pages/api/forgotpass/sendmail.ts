import { mailOptionsBirthday, transporter } from "@/config/nodemailer";
import { adminService } from "@/services/admin-service";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { env } from "process";
import { userService } from "@/services/user-service";

const DB = env.DB_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(DB!);
    }
  } catch (error) {
    console.error(error);
  }
  try {
    const { email } = req.body;
    const message = await userService.forgotPassword(email);
    res.status(200).json(message);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
}
