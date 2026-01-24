import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const baseUrl = process.env.URL || "https://www.limistudio.by/";

  res.setHeader("Content-Type", "text/plain");
  res.write(`User-agent: *
Allow: /

Disallow: /finishSignUp
Disallow: /groups
Disallow: /settings
Disallow: /admin

Sitemap: ${baseUrl}/sitemap.xml
`);
  res.end();
}
