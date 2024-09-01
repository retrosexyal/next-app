import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import fs from "fs";
import path from "path";

export async function generateDocument(data: any[]) {

  const content = fs.readFileSync(path.resolve("D:/ARTEM/trash/students.docx"), "binary");

  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });


  const docData = { contracts: data };


  doc.render(docData);


  const buffer = doc.getZip().generate({ type: "nodebuffer" }); 
  fs.writeFileSync(path.resolve("D:/ARTEM/trash/studentsOutput.docx"), buffer as unknown as Uint8Array );

  console.log("Файл Word успешно сохранен!");
}

