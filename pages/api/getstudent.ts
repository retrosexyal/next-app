import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { env } from "process";
import { adminService } from "@/services/admin-service";

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
    const students = await adminService.getAllStudents();
    return res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.statusCode = 400;
    res.json({ message: "ошибка получения учеников" });
  }
}
