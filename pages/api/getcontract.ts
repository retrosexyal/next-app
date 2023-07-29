import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { env } from "process";
import { contractService } from "@/services/contract-service";
import { checkAdmin, getUserInfo } from "@/helpers/helpers";

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
      const contract = await contractService.getContract(data.id);
      return res.status(200).json(contract);
    }
    const user = getUserInfo(req);

    if (user && (await contractService.getContract(user.id))) {
      const contract = await contractService.getContract(user.id);
      return res.status(200).json(contract);
    }
    return res.status(400).json({ message: "ошибка доступа" });
  } catch (error) {
    console.error(error);
    res.statusCode = 401;
    res.json({ message: "ошибка создания" });
  }
}
