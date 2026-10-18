import { verifyDownload } from "@/shop/delivery.ts";
import { getShopRuntime } from "@/shop/load.ts";

export const dynamic = "force-dynamic";

const headers = { "cache-control": "no-store", "x-robots-tag": "noindex", "content-type": "text/plain; charset=utf-8" } as const;

/**
 * Development-only download endpoint for the demo. It 404s everywhere else (including every production build). It
 * verifies the signed link (authentic, bound to the file and order, unexpired) and serves a labelled placeholder text file.
 * In production, files are served by the client's PRIVATE storage via provider-signed URLs; this site never serves them.
 */
export async function GET(request: Request) {
  const rt = await getShopRuntime();
  if (rt.mode !== "demo" || !rt.demo) return new Response("Not found", { status: 404, headers });
  const q = new URL(request.url).searchParams;
  const result = verifyDownload(
    { fileKey: q.get("key") ?? "", orderRef: q.get("order") ?? "", exp: Number(q.get("exp")), sig: q.get("sig") ?? "" },
    rt.demo.secret,
  );
  if (result === "invalid") return new Response("Invalid download link.", { status: 403, headers });
  if (result === "expired") return new Response("This download link has expired. Request a new link.", { status: 410, headers });
  const base = (q.get("name") ?? "demo").replace(/\.[a-z0-9]+$/i, "").replace(/[^a-z0-9-]/gi, "").slice(0, 60) || "demo";
  return new Response(rt.demo.fileText, { headers: { ...headers, "content-disposition": `attachment; filename="${base}-DEMO.txt"` } });
}
