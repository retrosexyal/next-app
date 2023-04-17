import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import cookie from "cookie";
import cookieParser from "cookie-parser";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = req.body;

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
