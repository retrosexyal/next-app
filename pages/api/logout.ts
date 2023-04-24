import { userService } from "@/services/user-service";
import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { refreshToken } = req.cookies;
    const token = await userService.logout(refreshToken!);
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("refreshToken", "", {
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
