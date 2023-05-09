import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import cookie from "cookie";
import mongoose from "mongoose";
import { userService } from "@/services/user-service";
import { env } from "process";

const DB = env.DB_URL;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log(mongoose.connection.readyState);
    console.log(DB);
    console.log(mongoose.connection.readyState !== 1);
    if (mongoose.connection.readyState !== 1) {
      console.log(mongoose.connection.readyState);
      await mongoose.connect(DB!);
      console.log("bd ok");
    }
    const data = req.body;
    /*    const userData = await userService.registration("email12222", "pass12222"); */
    /*     res.setHeader(
      "Set-Cookie",
      cookie.serialize("refreshToken", userData.refreshToken, {
        maxAge: 86400,
        path: "/",
        httpOnly: true,
      })
    ); */

    /* return res.json(userData); */
    return res.json({ message: "dsds" });
    res.statusCode = 200;
    const csrfToken = generateCsrfToken();
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("my_cookie_server", csrfToken, {
        maxAge: 86400,
        path: "/",
      })
    );
    res.json({
      test: csrfToken,
      url: req.url,
      methhod: req.method,
      headers: req.headers,
      query: req.query,
      cookies: req.cookies,
      rawHeaders: req.rawHeaders,
    });
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.json({ message: "Internal Server Error" });
  }
}
function generateCsrfToken() {
  const csrfBytes = new Uint8Array(32);
  crypto.getRandomValues(csrfBytes);
  return Array.from(csrfBytes, (byte) => byte.toString(16)).join("");
}
