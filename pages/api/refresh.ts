import { userService } from "@/services/user-service";
import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { refreshToken } = req.cookies;
    const userData = await userService.refresh(refreshToken!);
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        httpOnly: true,
      })
    );
    return res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    if ((error as Error).message === "ошибка обновления токена") {
      res.statusCode = 404;
      res.json({ message: "пользователь не найден" });
    } else {
      res.statusCode = 500;
      res.json({ message: "Internal Server Error" });
    }
  }
}
