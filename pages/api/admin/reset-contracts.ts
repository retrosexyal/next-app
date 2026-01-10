import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { env } from "process";
import { adminService } from "@/services/admin-service";
import { checkAdmin, returnNotAdmin } from "@/helpers/helpers";

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

    returnNotAdmin({ req, res });

    adminService.resetAllContractsAndUsers();

    res.status(200).json("сброс прошёл");
  } catch (error) {
    console.error(error);
    res.statusCode = 400;
    res.json({ message: "ошибка сброса" });
  }
}
