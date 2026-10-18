import { serializeJsonLd } from "@/seo/jsonld.ts";

/** Emits one structured-data block. Pass only data built by src/seo/jsonld.ts (confirmed facts only). */
export function JsonLd({ data }: { data: Record<string, unknown> | null }) {
  if (!data) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
