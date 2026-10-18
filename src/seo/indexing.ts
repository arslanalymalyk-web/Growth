/**
 * Whether this deployment may be indexed by search engines. Default is NO: staging, previews, local builds and any build
 * without an explicit launch switch stay out of search. Every condition must hold:
 *  - ALLOW_INDEXING=1 (explicit launch decision, set only on the live production site)
 *  - NODE_ENV=production
 *  - SITE_URL is a real https origin (not localhost / a private address)
 *  - the host platform does not report a preview/branch deployment (Vercel VERCEL_ENV, Netlify CONTEXT)
 */
export interface IndexingEnv {
  ALLOW_INDEXING?: string;
  NODE_ENV?: string;
  SITE_URL?: string;
  VERCEL_ENV?: string;
  CONTEXT?: string;
}
export interface IndexingDecision { enabled: boolean; reason: string }

export function isPublicHttpsOrigin(value: string | undefined): boolean {
  if (!value) return false;
  let u: URL;
  try { u = new URL(value); } catch { return false; }
  if (u.protocol !== "https:") return false;
  const h = u.hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".localhost") || h.endsWith(".local") || h.endsWith(".invalid")) return false;
  if (/^(127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(h) || /^172\.(1[6-9]|2\d|3[01])\./.test(h) || h === "[::1]") return false;
  return true;
}

export function decideIndexing(env: IndexingEnv): IndexingDecision {
  if (env.ALLOW_INDEXING !== "1") return { enabled: false, reason: "ALLOW_INDEXING is not 1 (default: not indexable)" };
  if (env.NODE_ENV !== "production") return { enabled: false, reason: "not a production build" };
  if (!isPublicHttpsOrigin(env.SITE_URL)) return { enabled: false, reason: "SITE_URL is not a public https origin" };
  if (env.VERCEL_ENV && env.VERCEL_ENV !== "production") return { enabled: false, reason: `hosting reports a ${env.VERCEL_ENV} deployment` };
  if (env.CONTEXT && env.CONTEXT !== "production") return { enabled: false, reason: `hosting reports a ${env.CONTEXT} deployment` };
  return { enabled: true, reason: "launch switch on for a production deployment" };
}

export function indexingEnabled(): boolean {
  return decideIndexing(process.env).enabled;
}
