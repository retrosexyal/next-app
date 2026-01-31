import type { NextApiRequest, NextApiResponse } from "next";

import Student from "@/models/group-student-model";
import Contract from "@/models/contract-model";
import {
  connectDB,
  requireGroupAccess,
  requireTeacher,
} from "@/helpers/helpers";
import { Types } from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const user = requireTeacher({ req, res });
  if (!user) return;

  const { groupId, contractId } = req.body;

  const group = await requireGroupAccess(groupId, user, res);
  if (!group) return;

  const contract = await Contract.findById(contractId);
  if (!contract) return res.status(404).json("контракт не найден");

  let student = await Student.findOne({
    contract: contract._id,
  });

  if (!student) {
    // пробуем найти временного
    student = await Student.findOne({
      fullName: contract.childrenName,
      phone: contract.phone,
      isTemp: true,
    });

    if (student) {
      student.contract = contract._id;
      student.isTemp = false;
      await student.save();
    } else {
      student = await Student.create({
        fullName: contract.childrenName,
        phone: contract.phone,
        contract: contract._id,
        isTemp: false,
      });
    }
  }

  const exists = group.students.some(
    (id: Types.ObjectId) => id.toString() === student._id.toString(),
  );

  if (!exists) {
    group.students.push(student._id);
    await group.save();
  }

  res.json(student);
}
