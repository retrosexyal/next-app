import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const baseUrl = process.env.URL || "https://www.limistudio.by/";
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");

  res.setHeader("Content-Type", "text/plain");
  res.write(`User-agent: *
Allow: /

Disallow: /finishSignUp
Disallow: /groups
Disallow: /settings
Disallow: /admin
Disallow: /teacher

Sitemap: ${normalizedBaseUrl}/sitemap.xml
`);
  res.end();
}
