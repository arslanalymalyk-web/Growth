import { createClient } from "@sanity/client";
import type { Product } from "./types.ts";

/**
 * Products are CONTENT and may live in the client's Sanity project (documents of type "product"). ORDERS, BUYERS AND
 * FILES NEVER DO: files stay in private storage (only an opaque key is stored here) and orders go to the order store.
 * Inactive until SANITY_PROJECT_ID and SANITY_DATASET are supplied.
 */
const configured = () => Boolean(process.env.SANITY_PROJECT_ID && process.env.SANITY_DATASET);

const QUERY = `*[_type == "product"]{
  "id": slug.current, status, isPreview, sectorId, title, summary, description, price, previewImage, file, licence, refund,
  review, approval, publishedAt }`;

const bilingual = (v: unknown): boolean => Boolean(v && typeof (v as { en?: unknown }).en === "string" && typeof (v as { ar?: unknown }).ar === "string");

/** Returns validated product documents, or null when Sanity is not configured/valid (the caller then uses the in-code config). */
export async function fetchProductsFromSanity(): Promise<Product[] | null> {
  if (!configured()) return null;
  const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID!, dataset: process.env.SANITY_DATASET!, apiVersion: process.env.SANITY_API_VERSION || "2025-01-01", useCdn: true,
  });
  const docs: unknown = await client.fetch(QUERY, {}, { next: { revalidate: 300 } });
  if (!Array.isArray(docs)) return null;
  const ok = docs.every((p: Partial<Product>) => typeof p.id === "string" && (p.status === "draft" || p.status === "published") && bilingual(p.title) && bilingual(p.summary) && bilingual(p.description) && p.review);
  // Sanity can never mark a document as a preview fixture.
  return ok ? (docs as Product[]).map((p) => ({ ...p, isPreview: false })) : null;
}
