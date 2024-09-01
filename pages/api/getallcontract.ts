import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { env } from "process";
import { contractService } from "@/services/contract-service";
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

    if (!checkAdmin(req)) {
      return res.status(403).json({ message: "нет доступа" });
    }

    const { method } = req;

    if (method === "GET") {
      const contracts = await contractService.getAllContract();
      return res.status(200).json(contracts);
    }

/* если необходимо что-то обновить    if (method === "POST") {
      const contracts = await contractService.changeContract();
      return res.status(200).json(contracts);
    } */

  } catch (error) {
    console.error(error);
    res.statusCode = 401;
    res.json({ message: "какая-то ошибка" });
  }
}
