import type { NextApiRequest, NextApiResponse } from "next";
import { timingSafeEqual } from "crypto";
import { serialize } from "cookie";
import mongoose from "mongoose";
import UserModel from "@/models/user-model";
import UserDto from "@/dtos/user-dto";
import TeacherModel from "@/models/teacher-model";
import { ADMIN_EMAIL } from "@/constants/constants";
import { tokenService } from "@/services/token-service";

const loopbackAddresses = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader("Cache-Control", "no-store");
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.LOCAL_HASH_LOGIN_ENABLED !== "true" ||
    !loopbackAddresses.has(req.socket.remoteAddress || "") ||
    !/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(req.headers.host || "")
  ) {
    return res.status(404).json({ message: "Not found" });
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }
  // A custom header prevents cross-origin HTML forms from invoking this route.
  if (req.headers["x-local-dev-login"] !== "1") {
    return res
      .status(403)
      .json({ message: "Local development header required" });
  }
  if (req.headers.origin) {
    try {
      if (new URL(req.headers.origin).host !== req.headers.host) {
        return res.status(403).json({ message: "Origin rejected" });
      }
    } catch {
      return res.status(403).json({ message: "Origin rejected" });
    }
  }
  const { email, hash } = req.body || {};
  if (
    typeof email !== "string" ||
    !email.trim() ||
    email.length > 320 ||
    typeof hash !== "string" ||
    !/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(hash)
  ) {
    return res.status(400).json({ message: "Provide email and a bcrypt hash" });
  }
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.DB_URL!);
    }
    const user = await UserModel.findOne({ email: email.trim() });
    const storedHash = Buffer.from(user?.password || "");
    const suppliedHash = Buffer.from(hash);
    if (
      !user ||
      storedHash.length !== suppliedHash.length ||
      !timingSafeEqual(storedHash as any, suppliedHash as any)
    ) {
      return res.status(401).json({ message: "Email or hash does not match" });
    }
    const isTeacher =
      user.email === ADMIN_EMAIL ||
      Boolean(await TeacherModel.exists({ email: user.email.toLowerCase() }));
    const userDto = new UserDto(user, isTeacher);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    res.setHeader(
      "Set-Cookie",
      serialize("refreshToken", tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        httpOnly: true,
        sameSite: "strict",
      }),
    );
    return res.status(200).json({ ...tokens, user: userDto });
  } catch {
    return res.status(500).json({ message: "Local login failed" });
  }
}
