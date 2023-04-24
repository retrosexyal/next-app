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
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.json({ message: "Internal Server Error" });
  }
}
