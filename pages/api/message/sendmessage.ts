import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { env } from "process";
import { contractService } from "@/services/contract-service";
import { checkAdmin } from "@/helpers/helpers";
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

    if (checkAdmin(req)) {
      const message = await adminService.sendMessage(data.id, data.message);
      return res.status(200).json(message);
    }
    return res.status(400).json({ message: "ошибка доступа" });
  } catch (error) {
    console.error(error);
    res.statusCode = 401;
    res.json({ message: "какая-то ошибка" });
  }
}
