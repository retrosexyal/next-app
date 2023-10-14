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
    const data = req.body;
    const studentData = await adminService.deleteStudent(data.id);
    return res.status(200).json(studentData);
  } catch (error) {
    console.error(error);
    res.statusCode = 400;
    res.json({ message: "ошибка удаления студента" });
  }
}
