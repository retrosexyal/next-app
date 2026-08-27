import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { v4 } from "uuid";

import { connectDB, requireAdmin } from "@/helpers/helpers";
import Teacher from "@/models/teacher-model";
import Token from "@/models/token-model";
import User from "@/models/user-model";

const normalizeEmail = (value: unknown) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await connectDB();
  const admin = requireAdmin({ req, res });
  if (!admin) return;

  if (req.method === "GET") {
    const teachers = await Teacher.find().sort({ email: 1 }).lean();
    return res.status(200).json(teachers);
  }

  if (req.method === "POST") {
    const email = normalizeEmail(req.body.email);
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!email || !email.includes("@") || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Укажите корректную почту и пароль от 6 символов" });
    }
    if (email === "admin@admin") {
      return res.status(400).json({ message: "Администратор уже добавлен" });
    }
    if (await Teacher.exists({ email })) {
      return res.status(409).json({ message: "Преподаватель уже есть в списке" });
    }
    if (await User.exists({ email })) {
      return res.status(409).json({ message: "Пользователь с такой почтой уже существует" });
    }

    const passwordHash = await bcrypt.hash(password, 7);
    const user = await User.create({
      email,
      password: passwordHash,
      name: email,
      isActivated: true,
      activationLink: v4(),
      status: "",
    });

    try {
      const teacher = await Teacher.create({ email });
      return res.status(201).json(teacher);
    } catch (error) {
      await User.findByIdAndDelete(user._id);
      throw error;
    }
  }

  if (req.method === "DELETE") {
    const email = normalizeEmail(req.body.email);
    if (!email || email === "admin@admin") {
      return res.status(400).json({ message: "Этого преподавателя удалить нельзя" });
    }

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ message: "Преподаватель не найден" });
    }

    const user = await User.findOne({ email });
    if (user) await Token.deleteMany({ user: user._id });
    await User.deleteOne({ email });
    await teacher.deleteOne();

    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  return res.status(405).end();
}
