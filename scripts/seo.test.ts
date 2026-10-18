import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { confirmedBusiness, type BusinessProfile } from "../src/seo/business.ts";
import { decideIndexing, isPublicHttpsOrigin } from "../src/seo/indexing.ts";
import { articleJsonLd, breadcrumbJsonLd, organizationJsonLd, serializeJsonLd, websiteJsonLd } from "../src/seo/jsonld.ts";
import { buildMetadata, languageAlternates, withBrand } from "../src/seo/metadata.ts";

const LIVE = { ALLOW_INDEXING: "1", NODE_ENV: "production", SITE_URL: "https://www.example.com" };

test("indexing is off by default and for every non-launch environment", () => {
  assert.equal(decideIndexing({}).enabled, false);
  assert.equal(decideIndexing({ NODE_ENV: "production", SITE_URL: "https://www.example.com" }).enabled, false, "no launch switch");
  assert.equal(decideIndexing({ ...LIVE, NODE_ENV: "development" }).enabled, false);
  assert.equal(decideIndexing({ ...LIVE, SITE_URL: undefined }).enabled, false);
  assert.equal(decideIndexing({ ...LIVE, SITE_URL: "http://www.example.com" }).enabled, false, "http origin");
  assert.equal(decideIndexing({ ...LIVE, SITE_URL: "https://localhost:3000" }).enabled, false);
  assert.equal(decideIndexing({ ...LIVE, SITE_URL: "https://staging.example.invalid" }).enabled, false);
  assert.equal(decideIndexing({ ...LIVE, VERCEL_ENV: "preview" }).enabled, false, "preview deployment");
  assert.equal(decideIndexing({ ...LIVE, CONTEXT: "deploy-preview" }).enabled, false);
  assert.equal(decideIndexing({ ...LIVE, ALLOW_INDEXING: "true" }).enabled, false, "only the exact value 1 counts");
});

test("indexing turns on only for an explicit public production launch", () => {
  assert.equal(decideIndexing(LIVE).enabled, true);
  assert.equal(decideIndexing({ ...LIVE, VERCEL_ENV: "production", CONTEXT: "production" }).enabled, true);
  assert.equal(isPublicHttpsOrigin("https://10.0.0.5"), false);
  assert.equal(isPublicHttpsOrigin("not a url"), false);
});

const withEnv = <T>(env: Record<string, string | undefined>, fn: () => T): T => {
  const old = { ...process.env };
  for (const [k, v] of Object.entries(env)) { if (v === undefined) delete process.env[k]; else process.env[k] = v; }
  try { return fn(); } finally { for (const k of Object.keys(env)) { if (old[k] === undefined) delete process.env[k]; else process.env[k] = old[k]; } }
};

test("hreflang: both languages plus x-default (default language) for bilingual pages", () => {
  assert.deepEqual(languageAlternates("/services"), { en: "/en/services", ar: "/ar/services", "x-default": "/en/services" });
  assert.deepEqual(languageAlternates(""), { en: "/en", ar: "/ar", "x-default": "/en" });
});

test("hreflang: a page with no translation has no alternate and no false x-default", () => {
  assert.deepEqual(languageAlternates("/insights/x", ["en"]), { en: "/en/insights/x", "x-default": "/en/insights/x" });
  assert.deepEqual(languageAlternates("/insights/x", ["ar"]), { ar: "/ar/insights/x" });
});

test("metadata: canonical, hreflang, Open Graph and Twitter for an indexable page", () => {
  withEnv(LIVE, () => {
    const m = buildMetadata({ locale: "ar", path: "/services", title: "الخدمات | Growth Blueprint Advisory", description: "وصف عربي", index: true });
    assert.deepEqual(m.alternates, { canonical: "/ar/services", languages: { en: "/en/services", ar: "/ar/services", "x-default": "/en/services" } });
    assert.deepEqual(m.robots, { index: true, follow: true });
    assert.equal((m.title as { absolute: string }).absolute, "الخدمات | Growth Blueprint Advisory", "Arabic text preserved");
    assert.equal(m.description, "وصف عربي");
    const og = m.openGraph as { locale: string; alternateLocale: string[]; url: string; siteName: string };
    assert.equal(og.locale, "ar_SA");
    assert.deepEqual(og.alternateLocale, ["en_US"]);
    assert.equal(og.url, "/ar/services");
    assert.equal(og.siteName, "Growth Blueprint Advisory");
    assert.equal((m.twitter as { card: string }).card, "summary", "no confirmed image, so no large-image card");
    assert.equal((m.openGraph as { images?: unknown }).images, undefined, "no invented social image");
  });
});

test("metadata: robots is noindex whenever the page OR the deployment is not indexable", () => {
  const page = { locale: "en", path: "/about", title: "About", description: "d" } as const;
  withEnv(LIVE, () => assert.deepEqual(buildMetadata({ ...page, index: false }).robots, { index: false, follow: false }));
  withEnv({ ...LIVE, ALLOW_INDEXING: undefined }, () => assert.deepEqual(buildMetadata({ ...page, index: true }).robots, { index: false, follow: false }));
  withEnv({ ...LIVE, VERCEL_ENV: "preview" }, () => assert.deepEqual(buildMetadata({ ...page, index: true }).robots, { index: false, follow: false }));
});

test("metadata: noindex pages carry no hreflang; brand suffix is added once", () => {
  withEnv(LIVE, () => assert.equal(buildMetadata({ locale: "en", path: "/book-consultation/details", title: "Details", index: false }).alternates?.languages, undefined));
  assert.equal(withBrand("About"), "About | Growth Blueprint Advisory");
  assert.equal(withBrand("About | Growth Blueprint Advisory"), "About | Growth Blueprint Advisory");
});

test("structured data: only confirmed facts. The real profile yields name and URL only", () => {
  const org = organizationJsonLd(confirmedBusiness, "https://www.example.com");
  assert.deepEqual(Object.keys(org).sort(), ["@context", "@id", "@type", "name", "url"]);
  assert.equal(org["@type"], "Organization");
  const text = JSON.stringify(org);
  for (const forbidden of ["aggregateRating", "review", "address", "telephone", "email", "logo", "sameAs", "areaServed", "LocalBusiness", "award"]) assert.ok(!text.includes(forbidden), forbidden);
  assert.equal(confirmedBusiness.address, null, "no address has been confirmed");
});

test("structured data: optional fields appear only when supplied", () => {
  const p: BusinessProfile = { ...confirmedBusiness, email: "hello@example.com", sameAs: ["https://www.linkedin.com/company/example"] };
  const org = organizationJsonLd(p, "https://www.example.com");
  assert.equal(org.email, "hello@example.com");
  assert.deepEqual(org.sameAs, ["https://www.linkedin.com/company/example"]);
  assert.equal("address" in org, false);
});

test("structured data: WebSite, breadcrumbs and articles", () => {
  const site = websiteJsonLd(confirmedBusiness, "https://www.example.com", "ar");
  assert.equal(site.inLanguage, "ar");
  assert.equal(site.url, "https://www.example.com/ar");
  assert.equal(breadcrumbJsonLd("https://x.test", [{ name: "Home" }]), null);
  const b = breadcrumbJsonLd("https://x.test", [{ name: "الرئيسية", path: "/ar" }, { name: "الخدمات" }]) as { itemListElement: { name: string; item?: string; position: number }[] };
  assert.equal(b.itemListElement[0].item, "https://x.test/ar");
  assert.equal(b.itemListElement[1].item, undefined, "current page has no item URL");
  assert.equal(b.itemListElement[0].name, "الرئيسية");
  const base = { locale: "en", slug: "a", headline: "H", description: "D", datePublished: null } as const;
  assert.equal(articleJsonLd("https://x.test", base, confirmedBusiness), null, "no confirmed date, no Article markup");
  const art = articleJsonLd("https://x.test", { ...base, datePublished: "2026-01-02" }, confirmedBusiness)!;
  assert.deepEqual(art.author, { "@id": "https://x.test/#organization" }, "author is the organisation, never an invented person");
  assert.equal("image" in art, false);
});

test("structured data: serialised output cannot break out of the script tag", () => {
  const s = serializeJsonLd({ name: "</script><script>alert(1)</script>", ar: "نص عربي" });
  assert.ok(!s.includes("</script>"));
  assert.ok(s.includes("نص عربي"), "Arabic preserved");
});

function* walk(dir: string): Generator<string> {
  for (const f of readdirSync(dir)) { const p = join(dir, f); if (statSync(p).isDirectory()) yield* walk(p); else yield p; }
}
test("source guard: no invented ratings, reviews or fake local-business details in src/seo", () => {
  for (const f of walk("src/seo")) {
    const t = readFileSync(f, "utf8");
    assert.ok(!/aggregateRating|ratingValue|reviewCount|"Review"/.test(t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "")), `${f} must not emit ratings/reviews`);
  }
});
