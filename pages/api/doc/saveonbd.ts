import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { env } from "process";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import fs from "fs";
import {
  transporter,
  test,
  mailOptionsRegist,
  mailOptionsBirthday,
} from "@/config/nodemailer";
import ShablonModel from "@/models/shablon-model";
import gridfs from "gridfs-stream";
import { GridFSBucket } from "mongodb";
import { contractService } from "@/services/contract-service";
import { IContract } from "@/interface/iContact";
import {
  formattedDate,
  getCurrentDate,
  returnNotAdmin,
} from "@/helpers/helpers";
import { userService } from "@/services/user-service";

const DB = env.DB_URL;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(DB!);
      console.log("bd ok");
    }
    const data = req.body;

    returnNotAdmin({ req, res });

    try {
      await contractService.updateContract(data.id);
    } catch (e) {
      res.status(500).json("ошибко обновления контракта");
    }
    try {
      await contractService.setNumberContract();
    } catch (e) {
      res.status(500).json("Ошибка установки номера контракта");
    }
    res.status(200).json("договор успешно сохранен");
  } catch (error) {
    console.error(error);
    res.statusCode = 400;
    res.json({ message: "ошибка добавления студента" });
  }
}
