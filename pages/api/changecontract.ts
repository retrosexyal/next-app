import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { env } from "process";
import { adminService } from "@/services/admin-service";
import { tokenService } from "@/services/token-service";
import { IUser } from "@/clientModels/IUser";
import { contractService } from "@/services/contract-service";

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
    const accessToken = req.headers["authorization"]?.split(" ")[1];
    if (accessToken) {
      const token = tokenService.validateAccessToken(accessToken!) as IUser;
      if (token.email === "admin@admin") {
        const contract = await contractService.getContract(data.info.user);
        contract.parentName = data.info.parentName;
        contract.childrenName = data.info.childrenName;
        contract.birthday = data.info.birthday;
        contract.place = data.info.place;
        contract.KB = data.info.KB;
        contract.pasportDate = data.info.pasportDate;
        contract.pasportPlace = data.info.pasportPlace;
        contract.phone = data.info.phone;
        await contract.save();
        return res.status(200).json(contract);
      } else res.status(401).json({ message: "you are not admin" });
    }
  } catch (error) {
    console.error(error);
    res.statusCode = 400;
    res.json({ message: "ошибка добавления студента" });
  }
}
