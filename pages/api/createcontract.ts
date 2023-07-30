import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { env } from "process";
import { contractService } from "@/services/contract-service";
import { tokenService } from "@/services/token-service";
import { IUser } from "@/clientModels/IUser";
import jwt from "jsonwebtoken";

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
    const data = req.body;
    const accessToken = req.headers["authorization"]?.split(" ")[1];

    const token = tokenService.validateAccessToken(accessToken!) as IUser;
    if (token.isActivated) {
      const contract = await contractService.createContract(
        token.id,
        data.info
      );
      console.log(token);
      return res.status(200).json({ message: "договор отправлен" });
    } else {
      return res.status(400).json({ message: "пользователь не авторизирован" });
    }
  } catch (error: any) {
    if (typeof error === "object" && "cause" in error) {
      res.statusCode = 404;
      res.json({ message: "договор уже есть" });
    } else {
      res.statusCode = 401;
      res.json({ message: "ошибка создания" });
    }
  }
}
