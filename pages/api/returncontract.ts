import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { env } from "process";
import { contractService } from "@/services/contract-service";
import { returnNotAdmin } from "@/helpers/helpers";

const DB = env.DB_URL;
const accessKey = env.ACCESS_TOKEN_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(DB!);
      console.log("bd ok");
    }
    const { userId, contractId } = req.body;

    if (!userId || !contractId) {
      res.status(404).json("net userId or contractId");

      return;
    }

    returnNotAdmin({ req, res });

    await contractService.deleteContract({
      contractId,
      userId,
    });

    res.status(200).json({ message: "договор возвращён" });

    return;
  } catch (error: any) {
    if (typeof error === "object" && "cause" in error) {
      res.statusCode = 404;
      res.json({ message: "договор не возвращён" });
    } else {
      res.statusCode = 401;
      res.json({ message: "ошибка возврата" });
    }
  }
}
