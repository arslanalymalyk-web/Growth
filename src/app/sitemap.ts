import type { MetadataRoute } from "next";
import { indexingEnabled } from "@/seo/indexing.ts";
import { sitemapRows } from "@/seo/pages.ts";

/**
 * Lists only indexable pages (see src/seo/pages.ts). Empty unless this deployment is allowed to be indexed, so staging and
 * previews never advertise URLs. No lastModified is emitted: the project has no confirmed modification dates.
 * Generated at BUILD time: ALLOW_INDEXING and SITE_URL must be set when building.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!indexingEnabled()) return [];
  return sitemapRows();
}
