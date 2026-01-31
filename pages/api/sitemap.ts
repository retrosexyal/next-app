import type { NextApiRequest, NextApiResponse } from "next";

const PAGES = ["/", "/dance", "/gymnastic", "/vacancies", "/privacy", "/terms"];

const EXCLUDED = [
  "/finishSignUp",
  "/settings",
  "/admin",
  "/teacher",
  "/password",
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const baseUrl = process.env.URL || "https://www.limistudio.by/";

  const normalize = (base: string, path: string) =>
    base.replace(/\/$/, "") + path;

  const urls = PAGES.filter((page) => !EXCLUDED.includes(page))
    .map((page) => {
      const loc = normalize(baseUrl, page);

      return `
  <url>
    <loc>${loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === "/" ? "1.0" : "0.8"}</priority>
  </url>`;
    })
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.write(sitemap);
  res.end();
}
