import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Short-lived signed download links (HMAC-SHA256 over file key, order reference and expiry). In production the CLIENT'S
 * private storage provider issues signed URLs (FileStorageProvider); this utility backs only the development demo
 * download route and documents the validation every link must pass: authentic, unexpired, bound to one order and file.
 */
export interface SignedParts { fileKey: string; orderRef: string; exp: number } // exp = unix seconds
const message = (p: SignedParts) => `${p.fileKey}\n${p.orderRef}\n${p.exp}`;

export function signDownload(p: SignedParts, secret: string): string {
  return createHmac("sha256", secret).update(message(p)).digest("hex");
}

export type VerifyResult = "ok" | "expired" | "invalid";
export function verifyDownload(p: SignedParts & { sig: string }, secret: string, nowSeconds: number = Math.floor(Date.now() / 1000)): VerifyResult {
  if (!Number.isInteger(p.exp) || !/^[0-9a-f]{64}$/.test(p.sig)) return "invalid";
  const expected = Buffer.from(signDownload(p, secret), "hex");
  const given = Buffer.from(p.sig, "hex");
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return "invalid"; // authenticity first, so expiry is not an oracle
  return nowSeconds >= p.exp ? "expired" : "ok"; // expiry is exclusive: a link never works after the UI says it has expired
}
