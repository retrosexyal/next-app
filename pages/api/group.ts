import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { env } from "process";
import { adminService } from "@/services/admin-service";
import { checkAdmin } from "@/helpers/helpers";

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
    const { name, students } = req.body;
    const isAdmin = checkAdmin(req);
    if (!isAdmin) {
      return res.status(401).json({ message: "you are not admin" });
    }
    console.log(name, students);
    console.log(req.body);


    try {
      const group = await adminService.createGroup({
        name: name,
        students: students,
      });
      return res.status(200).json(group);
    } catch (e) {
      return res.status(403).json(e);
    }
  } catch (error) {
    console.error(error);
    res.statusCode = 400;
    res.json({ message: "ошибка создания группы" });
  }
}
