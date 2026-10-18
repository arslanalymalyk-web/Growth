import type { NextConfig } from "next";

// Mirrors src/seo/indexing.ts (kept inline: the config file cannot import app modules). Anything that is not an explicit,
// public, production launch gets a noindex header on every response, in addition to meta robots and robots.txt.
const env = process.env;
const host = (() => { try { return new URL(env.SITE_URL ?? "").hostname; } catch { return ""; } })();
const publicHttps = (env.SITE_URL ?? "").startsWith("https://") && !!host && !/^(localhost|127\.|10\.|192\.168\.)/.test(host) && !/\.(local|localhost|invalid)$/.test(host);
const indexable = env.ALLOW_INDEXING === "1" && env.NODE_ENV === "production" && publicHttps
  && (!env.VERCEL_ENV || env.VERCEL_ENV === "production") && (!env.CONTEXT || env.CONTEXT === "production");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Branded bilingual 404 for URLs that match no page (the root layout is a [lang] segment, so a normal not-found cannot wrap it).
  experimental: { globalNotFound: true },
  async headers() {
    return indexable ? [] : [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
