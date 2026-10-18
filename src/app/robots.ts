import type { MetadataRoute } from "next";
import { siteUrl } from "@/i18n/config";
import { indexingEnabled } from "@/seo/indexing.ts";

export default function robots(): MetadataRoute.Robots {
  if (!indexingEnabled()) return { rules: [{ userAgent: "*", disallow: "/" }] }; // staging, preview, local, or pre-launch
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }], sitemap: `${siteUrl()}/sitemap.xml` };
}
