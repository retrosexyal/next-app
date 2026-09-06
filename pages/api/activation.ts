import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB, getUserFromReq } from "@/helpers/helpers";
import UserModel from "@/models/user-model";
import { resendActivationEmail, retryAfterSeconds } from "@/services/activation-service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).end();
  }
  const identity = getUserFromReq(req);
  if (!identity) return res.status(401).json({ message: "Войдите в учётную запись" });
  try {
    await connectDB();
    if (req.method === "GET") {
      const user = await UserModel.findById(identity.id);
      if (!user) return res.status(401).json({ message: "Войдите в учётную запись" });
      return res.status(200).json({ isActivated: user.isActivated, retryAfter: retryAfterSeconds(user.activationEmailNextAllowedAt) });
    }
    const { status, ...result } = await resendActivationEmail(identity.id);
    if (result.retryAfter) res.setHeader("Retry-After", String(result.retryAfter));
    return res.status(status).json(result);
  } catch {
    return res.status(500).json({ message: "Не удалось выполнить запрос. Попробуйте позже." });
  }
}
