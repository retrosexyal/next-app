import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { env } from "process";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { transporter, mailOptionsBirthday } from "@/config/nodemailer";
import { GridFSBucket } from "mongodb";
import { contractService } from "@/services/contract-service";
import { IContract } from "@/interface/iContact";
import { formattedDate, getCurrentDate } from "@/helpers/helpers";
import { userService } from "@/services/user-service";

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
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db);
    const contract = (await contractService.getContract(data.id)) as IContract;
    const user = await userService.getUser(data.id);
    const numberContract = await contractService.getNumberContract();

    const fileName = "dogovor.docx";

    // Найти файл в базе данных и получить поток данных
    const file = await bucket.find({ filename: fileName }).toArray();
    if (file.length === 0) {
      throw new Error(`Файл ${fileName} не найден в базе данных`);
    }
    const readStream = bucket.openDownloadStreamByName(fileName);

    // Прочитать содержимое файла из потока данных
    const chunks: Buffer[] = [];
    readStream.on("data", (chunk) => {
      chunks.push(chunk);
    });
    readStream.on("end", async () => {
      const content = Buffer.concat(chunks as unknown[] as Uint8Array[]);

      // Создать объект PizZip на основе содержимого файла
      const zip = new PizZip(content);

      // Создать объект Docxtemplater на основе объекта PizZip
      const doc = new Docxtemplater();
      doc.loadZip(zip);

      // Задать данные для заполнения шаблона
      const data = {
        parentName: contract.parentName,
        childrenName: contract.childrenName,
        birthday: formattedDate(contract.birthday),
        diseases: contract.diseases,
        place: contract.place,
        KB: contract.KB,
        pasportDate: formattedDate(contract.pasportDate),
        pasportPlace: contract.pasportPlace,
        phone: contract.phone,
        number: numberContract,
        date: getCurrentDate(),
      };

      // Заполнить шаблон данными и обработать его
      doc.setData(data);
      doc.render();

      // Получить буфер с обновленным содержимым документа
      const generatedDoc = await doc.getZip().generate({ type: "nodebuffer" });

      if (!generatedDoc) {
        res.status(500).json("не смог создать файл");
      }

      try {
        await transporter.sendMail({
          ...mailOptionsBirthday,
          subject: "Договор",
          text: "Копия договора во вложении",
          attachments: [
            {
              filename: `${user.email}договор.docx`,
              content: generatedDoc,
            },
          ],
        });
      } catch (e) {
        res.status(500).json("ошибка отправки договора админу");
      }
    });

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
