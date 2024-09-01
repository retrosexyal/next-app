import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { env } from "process";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import fs from "fs";
import { transporter, test } from "@/config/nodemailer";
import ShablonModel from "@/models/shablon-model";
import gridfs from "gridfs-stream";
import { GridFSBucket } from "mongodb";

const DB = env.DB_URL;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
/*     if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(DB!);
      console.log("bd ok");
    }
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db);
    const readStream = fs.createReadStream("D:/ARTEM/trash/dogovor.docx");
    const uploadStream = bucket.openUploadStream("dogovor.docx");

    readStream.pipe(uploadStream);

    uploadStream.on("finish", () => {
      console.log(`File saved to MongoDB with id:`);
    }); */
/* раскоментить всё сверху для добавления в БД файла */
    /* const gfs = gridfs(mongoose.connection.db, mongoose.mongo); */

    //const data = req.body;
    /* const content = fs.readFileSync("D:/ARTEM/trash/dogovor.docx", "binary");
    const zip = new PizZip(content);
    const doc = new Docxtemplater();
    doc.loadZip(zip); */
    /* doc.setData({
      name: "John Smith",
    }); */
    /* doc.render();
    const generatedDoc = await doc.getZip().generate({ type: "nodebuffer" });
    await ShablonModel.create({ name: "Shablon", data: generatedDoc }); */
    /* const content = fs.readFileSync("D:/ARTEM/trash/dogovor.docx", "binary"); */

    /* const data = await ShablonModel.findOne({ name: "Shablon" }); */
    /* const zip = new PizZip(data.data);
    const doc = new Docxtemplater();
    doc.loadZip(zip);
    doc.setData({
      name: "AAAAAAAAAAAAAAAAAaaaa",
    });
    doc.render();
    const generatedDoc = await doc.getZip().generate({ type: "nodebuffer" }); */
    /* await transporter.sendMail({
      ...test,
      subject: "Договор",
      text: "Копия договора во вложении",
      attachments: [
        {
          filename: `${data.name}.docx`,
          content: data.data,
        },
      ],
    }); */
    /* const zip = new PizZip(content);
    const doc = new Docxtemplater();
    doc.loadZip(zip);
    doc.render();
    const generatedDoc = await doc.getZip().generate({ type: "nodebuffer" });
    await ShablonModel.create({ name: "Shablon", data: generatedDoc }); */
    /* doc.setData({
      name: "AAAAAAAAAAAAAAAAAaaaa",
    });
    doc.render();
    const generatedDoc = await doc.getZip().generate({ type: "nodebuffer" });

    await transporter.sendMail({
      ...test,
      subject: "Договор",
      text: "Копия договора во вложении",
      attachments: [
        {
          filename: `${data.name}.docx`,
          content: generatedDoc,
        },
      ],
    }); */

    /* fs.writeFile("D:/ARTEM/trash/generated_doc.pdf", generatedPDF, (err) => {
      if (err) throw err;
      console.log("File saved successfully");
    }); */

    res.status(200).json("dsd");
  } catch (error) {
    console.error(error);
    res.statusCode = 400;
    res.json({ message: "ошибка добавления студента" });
  }
}

/*  const gfs = gridfs(mongoose.connection.db, mongoose.mongo);
    const writeStream = gfs.createWriteStream({
      filename: "dogovor.docx",
    });
    fs.createReadStream("D:/ARTEM/trash/dogovor.docx").pipe(writeStream);

    writeStream.on("close", (file) => {
      console.log(`File saved to MongoDB with id: ${file._id}`);
    }); */

/* 
    const readStream = fs.createReadStream("D:/ARTEM/trash/dogovor.docx");
    const uploadStream = bucket.openUploadStream("dogovor.docx");

    readStream.pipe(uploadStream);

    uploadStream.on("finish", () => {
      console.log(`File saved to MongoDB with id:`);
    }); */
