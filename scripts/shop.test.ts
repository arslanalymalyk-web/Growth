// Run with: npm run test:shop (Node's built-in test runner; no extra dependencies).
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { industrySlugs } from "../src/content/catalog.ts";
import { requestDownloadLink, startProductCheckout } from "../src/shop/actions.ts";
import { realShop } from "../src/shop/config.ts";
import { signDownload, verifyDownload } from "../src/shop/delivery.ts";
import { DEMO_SIGNING_SECRET, demoOrders, demoPayment, demoShop, demoStorage } from "../src/shop/demo.ts";
import { issueDownloadLink, prepareProductCheckout, type FlowDeps } from "../src/shop/flow.ts";
import { localizeShop } from "../src/shop/localize.ts";
import { resolveShopMode } from "../src/shop/mode.ts";
import { installedShopProviders } from "../src/shop/providers.ts";
import { catalogueFacets, checkEmail, deriveOrderState, formatDuration, formatFileSize, productState, visibleProducts } from "../src/shop/rules.ts";
import type { PaymentStatus, Product, ShopConfig, ShopMode, ShopProviders } from "../src/shop/types.ts";
import { validateProduct, validateShopConfig } from "../src/shop/validate.ts";

const clone = <T,>(v: T): T => structuredClone(v);
const txt = { en: "x", ar: "x" };
const codes = (xs: { code: string }[]) => new Set(xs.map((i) => i.code));

/** A fully valid product made ONLY for tests, to prove the validators can pass. Never shipped. */
const goodProduct = (id = "test-brief"): Product => ({
  id, status: "published", isPreview: false, sectorId: "real-estate",
  title: txt, summary: txt, description: txt,
  price: { amountMinor: 5000, currency: "SAR" },
  previewImage: null,
  file: { key: `briefs/${id}.pdf`, format: "pdf", sizeBytes: 1_200_000 },
  licence: txt, refund: txt,
  review: { en: "approved", ar: "approved" },
  approval: { approvedBy: "Test Approver", approvedAt: "2000-01-01" },
  publishedAt: "2000-01-01",
});
/** Complete approved shop for tests (with matching stub providers). */
const approvedShop = (): ShopConfig => ({
  ...clone(realShop),
  id: "test-only", status: "approved", review: { en: "approved", ar: "approved" },
  approval: { approvedBy: "Test Approver", approvedAt: "2000-01-01" },
  products: [goodProduct()],
  delivery: { method: "signed-link", linkValiditySeconds: 600, maxDownloadsPerOrder: 3 },
  terms: { purchaseTerms: txt, purchaseCommunications: txt, marketingConsent: txt, privacy: txt },
  providers: { payment: "test-pay", storage: "test-store", orders: "test-orders" },
});
const stubs = (over: Partial<Record<"pay" | "store" | "orders", string>> = {}): ShopProviders => ({
  payment: { ...demoPayment, id: over.pay ?? "test-pay" },
  storage: { ...demoStorage, id: over.store ?? "test-store" },
  orders: { ...demoOrders, id: over.orders ?? "test-orders" },
});

test("the real shop is an empty draft: no products, not live, nothing purchasable", () => {
  assert.equal(realShop.status, "draft");
  assert.equal(realShop.products.length, 0);
  assert.deepEqual(installedShopProviders, { payment: null, storage: null, orders: null });
  const c = codes(validateShopConfig(realShop));
  for (const code of ["not-approved", "no-approval-record", "review-not-approved", "delivery-validity-missing", "delivery-limit-missing", "terms-missing", "payment-provider-missing", "storage-provider-missing", "order-store-missing"]) assert.ok(c.has(code), `expected ${code}`);
  const r = resolveShopMode({ nodeEnv: "production", demoFlag: undefined, real: realShop, providers: installedShopProviders, demo: null });
  assert.equal(r.mode, "unavailable");
  assert.deepEqual(visibleProducts(r.config.products, r.mode, industrySlugs), []);
});

test("mode: demo only in development with SHOP_DEMO=1; a demo config is never live", () => {
  const base = { real: realShop, providers: installedShopProviders, demo: demoShop };
  for (const [nodeEnv, flag] of [["production", undefined], ["production", "1"], ["test", "1"], [undefined, "1"], ["development", undefined], ["development", "0"]] as const) {
    assert.equal(resolveShopMode({ ...base, nodeEnv, demoFlag: flag }).mode, "unavailable", `${nodeEnv}/${flag}`);
  }
  assert.equal(resolveShopMode({ ...base, nodeEnv: "development", demoFlag: "1" }).mode, "demo");
  assert.equal(resolveShopMode({ ...base, demo: null, nodeEnv: "development", demoFlag: "1" }).mode, "unavailable");
  assert.ok(codes(validateShopConfig(demoShop)).has("demo-fixture"));
  assert.notEqual(resolveShopMode({ real: demoShop, providers: stubs("demo-payment" as never) as never, demo: null, nodeEnv: "production", demoFlag: "1" }).mode, "live");
});

test("live needs a valid shop AND all three matching providers", () => {
  const base = { nodeEnv: "production", demoFlag: undefined, demo: null } as const;
  assert.deepEqual(validateShopConfig(approvedShop()), []);
  assert.equal(resolveShopMode({ ...base, real: approvedShop(), providers: stubs() }).mode, "live");
  for (const missing of ["payment", "storage", "orders"] as const) assert.equal(resolveShopMode({ ...base, real: approvedShop(), providers: { ...stubs(), [missing]: null } }).mode, "unavailable", `missing ${missing}`);
  for (const over of [{ pay: "x" }, { store: "x" }, { orders: "x" }]) assert.equal(resolveShopMode({ ...base, real: approvedShop(), providers: stubs(over) }).mode, "unavailable", `mismatch ${Object.keys(over)}`);
});

test("shop-level approval ingredients each block activation", () => {
  const cases: [string, (c: ShopConfig) => void, string][] = [
    ["draft", (c) => { c.status = "draft"; }, "not-approved"],
    ["no approval record", (c) => { c.approval = null; }, "no-approval-record"],
    ["arabic unreviewed", (c) => { c.review.ar = "needs-professional-review"; }, "review-not-approved"],
    ["validity undecided", (c) => { c.delivery.linkValiditySeconds = null; }, "delivery-validity-missing"],
    ["validity not short-lived (> 1h)", (c) => { c.delivery.linkValiditySeconds = 86_400; }, "delivery-validity-invalid"],
    ["validity zero", (c) => { c.delivery.linkValiditySeconds = 0; }, "delivery-validity-invalid"],
    ["download limit undecided", (c) => { c.delivery.maxDownloadsPerOrder = null; }, "delivery-limit-missing"],
    ["no purchase terms", (c) => { c.terms.purchaseTerms = null; }, "terms-missing"],
    ["no communications notice", (c) => { c.terms.purchaseCommunications = null; }, "terms-missing"],
    ["no marketing consent text", (c) => { c.terms.marketingConsent = null; }, "terms-missing"],
    ["no privacy", (c) => { c.terms.privacy = { en: "x", ar: "" }; }, "terms-missing"],
    ["no payment", (c) => { c.providers.payment = null; }, "payment-provider-missing"],
    ["no storage", (c) => { c.providers.storage = null; }, "storage-provider-missing"],
    ["no order store", (c) => { c.providers.orders = null; }, "order-store-missing"],
    ["duplicate product ids", (c) => { c.products.push(goodProduct()); }, "duplicate-id"],
  ];
  for (const [name, mutate, code] of cases) {
    const c = approvedShop(); mutate(c);
    assert.ok(codes(validateShopConfig(c)).has(code), `${name}: expected ${code}`);
  }
});

test("product validation: every missing ingredient makes a product unsellable", () => {
  assert.deepEqual(validateProduct(goodProduct(), industrySlugs), []);
  const cases: [string, (p: Product) => void, string][] = [
    ["draft", (p) => { p.status = "draft"; }, "not-published"],
    ["preview fixture", (p) => { p.isPreview = true; }, "preview-fixture"],
    ["no approval", (p) => { p.approval = null; }, "no-approval-record"],
    ["arabic unreviewed", (p) => { p.review.ar = "needs-professional-review"; }, "review-not-approved"],
    ["missing arabic title", (p) => { p.title = { en: "x", ar: "" }; }, "text-missing-translation"],
    ["no price", (p) => { p.price = null; }, "price-missing"],
    ["float price", (p) => { p.price = { amountMinor: 1.5, currency: "SAR" }; }, "price-invalid"],
    ["bad currency", (p) => { p.price = { amountMinor: 100, currency: "sar" }; }, "price-invalid"],
    ["no file", (p) => { p.file = null; }, "file-missing"],
    ["file key is a URL", (p) => { p.file!.key = "https://cdn.example.com/brief.pdf"; }, "file-key-invalid"],
    ["file key is a public path", (p) => { p.file!.key = "/public/brief.pdf"; }, "file-key-invalid"],
    ["file key traversal", (p) => { p.file!.key = "briefs/../secret.pdf"; }, "file-key-invalid"],
    ["no file size", (p) => { p.file!.sizeBytes = 0; }, "file-size-missing"],
    ["no licence", (p) => { p.licence = null; }, "licence-missing"],
    ["no refund terms", (p) => { p.refund = null; }, "refund-missing"],
    ["unknown sector", (p) => { p.sectorId = "not-a-sector"; }, "unknown-sector"],
    ["http preview image", (p) => { p.previewImage = { url: "http://x/y.png", alt: txt }; }, "preview-image-invalid"],
    ["bad slug", (p) => { p.id = "Bad Slug"; }, "bad-slug"],
    ["reserved slug (would shadow /shop/order)", (p) => { p.id = "order"; }, "bad-slug"],
    ["reserved slug (demo checkout)", (p) => { p.id = "demo-checkout"; }, "bad-slug"],
  ];
  for (const [name, mutate, code] of cases) {
    const p = goodProduct(); mutate(p);
    assert.ok(codes(validateProduct(p, industrySlugs)).has(code), `${name}: expected ${code}`);
  }
});

test("DRAFT and PREVIEW products can never be purchasable in production", () => {
  const draft = { ...goodProduct(), status: "draft" as const };
  const preview = { ...goodProduct(), isPreview: true };
  const good = goodProduct();
  for (const mode of ["live", "unavailable"] as ShopMode[]) {
    assert.equal(productState(draft, mode, industrySlugs), "hidden", `draft/${mode}`);
    assert.equal(productState(preview, mode, industrySlugs), "hidden", `preview/${mode}`);
    // even a fully valid-looking product with isPreview stays hidden; and a draft is never "purchasable"
    assert.notEqual(productState(draft, mode), "purchasable");
    assert.notEqual(productState(preview, mode), "purchasable");
  }
  assert.equal(productState(good, "live", industrySlugs), "purchasable");
  assert.equal(productState(good, "unavailable", industrySlugs), "unavailable", "approved but providers missing: read-only, not purchasable");
  assert.equal(productState({ ...good, price: null }, "live", industrySlugs), "hidden", "published but invalid stays hidden");
  assert.equal(productState({ ...good, licence: null }, "unavailable", industrySlugs), "hidden");
  // demo: published previews are shown as previews; the draft preview is hidden even in the demo
  const states = demoShop.products.map((p) => [p.id, productState(p, "demo")]);
  assert.deepEqual(states, [["preview-sample-a", "preview"], ["preview-sample-b", "preview"], ["preview-sample-c", "preview"], ["preview-draft-d", "hidden"]]);
  assert.equal(demoShop.products.some((p) => productState(p, "demo") === ("purchasable" as string)), false);
  // the full demo catalogue seen through any production mode is empty
  for (const mode of ["live", "unavailable"] as ShopMode[]) assert.deepEqual(visibleProducts(demoShop.products, mode), []);
});

test("localised view: hidden products dropped and the private file key never leaves the server", () => {
  const live = localizeShop(approvedShop(), "live", "en", industrySlugs);
  assert.equal(live.products.length, 1);
  assert.equal(live.products[0].state, "purchasable");
  assert.ok(!JSON.stringify(live).includes("briefs/test-brief.pdf"), "file key leaked to the client view");
  assert.equal(localizeShop(demoShop, "unavailable", "ar").products.length, 0);
  const demo = localizeShop(demoShop, "demo", "ar");
  assert.equal(demo.products.length, 3);
  assert.ok(!JSON.stringify(demo).includes("demo/preview-sample"), "file key leaked");
  assert.ok(demo.products.every((p) => p.isPreview && p.state === "preview"));
});

test("catalogue filters are offered only when the data supports them", () => {
  const p = (sectorId: string | null, format: "pdf" | "xlsx" | null) => ({ sectorId, file: format ? { format, sizeBytes: 1 } : null });
  assert.deepEqual(catalogueFacets([]), { sectors: [], formats: [] });
  assert.deepEqual(catalogueFacets([p("a", "pdf")]), { sectors: [], formats: [] });
  assert.deepEqual(catalogueFacets([p("a", "pdf"), p("a", "pdf")]), { sectors: [], formats: [] });
  assert.deepEqual(catalogueFacets([p("a", "pdf"), p("b", "pdf")]), { sectors: ["a", "b"], formats: [] });
  assert.deepEqual(catalogueFacets([p("a", "pdf"), p("a", "xlsx")]), { sectors: [], formats: ["pdf", "xlsx"] });
  assert.deepEqual(catalogueFacets([p(null, null), p("a", "pdf")]), { sectors: [], formats: [] });
});

test("file size formatting (decimal units, Latin digits in Arabic)", () => {
  assert.equal(formatFileSize(540_000, "en"), "540 kB");
  assert.match(formatFileSize(2_400_000, "en"), /^2\.4\s?MB$/);
  assert.match(formatFileSize(2_400_000, "ar"), /^2\.4\s/);
  assert.match(formatFileSize(1_500_000_000, "en"), /GB$/);
});

test("durations use proper plural forms (seconds under a minute, minutes otherwise)", () => {
  assert.equal(formatDuration(1, "en"), "1 second");
  assert.equal(formatDuration(15, "en"), "15 seconds");
  assert.equal(formatDuration(60, "en"), "1 minute");
  assert.equal(formatDuration(600, "en"), "10 minutes");
  assert.match(formatDuration(15, "ar"), /^15 /);
  assert.notEqual(formatDuration(600, "ar"), formatDuration(60, "ar"));
});

test("signed download links: authentic, bound to file and order, short-lived", () => {
  const exp = 1_000_000;
  const parts = { fileKey: "briefs/a.pdf", orderRef: "ORD-1", exp };
  const sig = signDownload(parts, "s3cret");
  assert.equal(verifyDownload({ ...parts, sig }, "s3cret", exp - 1), "ok");
  assert.equal(verifyDownload({ ...parts, sig }, "s3cret", exp), "expired", "expiry is exclusive: dead at the expiry second");
  assert.equal(verifyDownload({ ...parts, sig }, "s3cret", exp + 1), "expired");
  assert.equal(verifyDownload({ ...parts, fileKey: "briefs/b.pdf", sig }, "s3cret", exp - 1), "invalid", "bound to the file");
  assert.equal(verifyDownload({ ...parts, orderRef: "ORD-2", sig }, "s3cret", exp - 1), "invalid", "bound to the order");
  assert.equal(verifyDownload({ ...parts, exp: exp + 3600, sig }, "s3cret", exp - 1), "invalid", "expiry cannot be extended");
  assert.equal(verifyDownload({ ...parts, sig }, "other-secret", exp - 1), "invalid");
  assert.equal(verifyDownload({ ...parts, sig: "zz" }, "s3cret", exp - 1), "invalid");
  assert.equal(verifyDownload({ ...parts, sig: sig.slice(0, 62) + "00" }, "s3cret", exp - 1), "invalid");
  assert.equal(verifyDownload({ ...parts, exp: NaN, sig }, "s3cret"), "invalid");
  assert.equal(verifyDownload({ ...parts, sig }, "s3cret", exp + 1_000_000), "expired", "tampering is reported before expiry only when authentic");
});

test("order return state: 'confirmed' only on provider-verified payment", () => {
  for (const route of ["confirmation", "pending", "failed"] as const) {
    assert.equal(deriveOrderState(route, "paid"), "confirmed");
    assert.equal(deriveOrderState(route, "pending"), "pending");
    assert.equal(deriveOrderState(route, "failed"), "failed");
    assert.equal(deriveOrderState(route, "cancelled"), "cancelled");
    assert.equal(deriveOrderState(route, "expired"), "checkout-expired");
  }
  for (const s of ["no-session", "unknown"] as const) {
    assert.equal(deriveOrderState("confirmation", s), "unverified");
    assert.notEqual(deriveOrderState("pending", s), "confirmed");
    assert.notEqual(deriveOrderState("failed", s), "confirmed");
  }
});

test("buyer email validation", () => {
  assert.equal(checkEmail(""), "required");
  assert.equal(checkEmail("   "), "required");
  assert.equal(checkEmail("nope"), "invalid");
  assert.equal(checkEmail("a@b"), "invalid");
  assert.equal(checkEmail("a@b.co"), null);
  assert.equal(checkEmail("a".repeat(170) + "@b.co"), "too-long");
});

const deps = (mode: ShopMode, config: ShopConfig, providers: ShopProviders): FlowDeps => ({ mode, config, providers, sectorSlugs: industrySlugs });
const demoDeps = (): FlowDeps => deps("demo", demoShop, { payment: demoPayment, storage: demoStorage, orders: demoOrders });

test("checkout handoff: unavailable outside the demo, never live in this stage, carries no buyer data", async () => {
  assert.equal((await prepareProductCheckout(deps("unavailable", realShop, installedShopProviders), { productId: "x", locale: "en" })).ok, false);
  const live = await prepareProductCheckout(deps("live", approvedShop(), stubs()), { productId: "test-brief", locale: "en" });
  assert.ok(!live.ok && live.error.code === "not-enabled", "live checkout must stay disabled until the client approves processing");
  const ok = await prepareProductCheckout(demoDeps(), { productId: "preview-sample-a", locale: "ar" });
  assert.ok(ok.ok && ok.value.checkoutUrl === "/ar/shop/demo-checkout?product=preview-sample-a");
  for (const bad of [{ productId: "nope", locale: "en" }, { productId: "preview-draft-d", locale: "en" }, { productId: "preview-sample-a", locale: "fr" }]) {
    assert.equal((await prepareProductCheckout(demoDeps(), bad as never)).ok, false, JSON.stringify(bad));
  }
});

test("download link: only for provider-verified, order-matched, purchasable products within limits", async () => {
  // demo providers: session id encodes the outcome and product
  const ok = await issueDownloadLink(demoDeps(), { session: "demo_paid_preview-sample-a", locale: "en" });
  assert.ok(ok.ok);
  if (ok.ok) {
    assert.equal(ok.value.expiresInSeconds, 15);
    assert.ok(ok.value.url.startsWith("/api/shop/demo-file?"), "link goes through the signed route, not a static file");
    const q = new URL(ok.value.url, "http://x").searchParams;
    assert.equal(verifyDownload({ fileKey: q.get("key")!, orderRef: q.get("order")!, exp: Number(q.get("exp")), sig: q.get("sig")! }, DEMO_SIGNING_SECRET), "ok");
    assert.ok(Date.parse(ok.value.expiresAt) - Date.now() <= 15_500, "short-lived");
    assert.equal(q.get("name"), "preview-sample-a.pdf");
  }
  for (const s of ["pending", "failed", "cancelled", "expired"]) {
    const r = await issueDownloadLink(demoDeps(), { session: `demo_${s}_preview-sample-a`, locale: "en" });
    assert.ok(!r.ok && r.error.code === "not-paid", `${s} must not release a file`);
  }
  const unknownSession = await issueDownloadLink(demoDeps(), { session: "forged-session", locale: "en" });
  assert.ok(!unknownSession.ok && unknownSession.error.code === "not-paid");
  const noProduct = await issueDownloadLink(demoDeps(), { session: "demo_paid_does-not-exist", locale: "en" });
  assert.ok(!noProduct.ok && noProduct.error.code === "not-found");
  const draft = await issueDownloadLink(demoDeps(), { session: "demo_paid_preview-draft-d", locale: "en" });
  assert.ok(!draft.ok && draft.error.code === "not-found", "a draft product's file is never released");
  for (const bad of ["", "x".repeat(201), 42 as unknown as string]) assert.ok(!(await issueDownloadLink(demoDeps(), { session: bad, locale: "en" })).ok);
  assert.ok(!(await issueDownloadLink(demoDeps(), { session: "demo_paid_preview-sample-a", locale: "fr" as never })).ok);

  // stubbed live setup: limits and unavailability
  const config = approvedShop();
  let used = 0; let recorded = 0;
  const providers: ShopProviders = {
    payment: { id: "test-pay", createCheckoutSession: demoPayment.createCheckoutSession, getCheckoutStatus: async (s) => ({ ok: true, value: (s === "paid-session" ? "paid" : "pending") as PaymentStatus }) },
    storage: { id: "test-store", createSignedDownload: async (r) => ({ ok: true, value: { url: `https://storage.example/${encodeURIComponent(r.fileKey)}?ttl=${r.expiresInSeconds}`, expiresAt: "2000-01-01T00:10:00Z" } }) },
    orders: { id: "test-orders", getBySession: async () => ({ ok: true, value: { orderRef: "ORD-1", productId: "test-brief", downloadsUsed: used } }), recordDownload: async () => { recorded++; return { ok: true, value: undefined }; } },
  };
  const live = deps("live", config, providers);
  const first = await issueDownloadLink(live, { session: "paid-session", locale: "en" });
  assert.ok(first.ok && first.value.url.includes("ttl=600") && recorded === 1);
  assert.deepEqual(Object.keys(first.ok ? first.value : {}).sort(), ["expiresAt", "expiresInSeconds", "url"], "the result exposes only the signed link and its expiry");
  used = 3;
  const limited = await issueDownloadLink(live, { session: "paid-session", locale: "en" });
  assert.ok(!limited.ok && limited.error.code === "limit-reached" && recorded === 1, "no link and no extra download recorded past the limit");
  used = 0;
  const unpaid = await issueDownloadLink(live, { session: "other", locale: "en" });
  assert.ok(!unpaid.ok && unpaid.error.code === "not-paid");
  assert.ok(!(await issueDownloadLink(deps("unavailable", config, providers), { session: "paid-session", locale: "en" })).ok);
  assert.ok(!(await issueDownloadLink(deps("live", config, { ...providers, storage: null }), { session: "paid-session", locale: "en" })).ok);
  const failing: ShopProviders = { ...providers, payment: { ...providers.payment!, getCheckoutStatus: async () => ({ ok: false, error: { code: "provider-error", message: "boom" } }) } };
  const pe = await issueDownloadLink(deps("live", config, failing), { session: "paid-session", locale: "en" });
  assert.ok(!pe.ok && pe.error.code === "provider-error");
});

test("server actions refuse outside the development demo", async () => {
  const env = { NODE_ENV: process.env.NODE_ENV, SHOP_DEMO: process.env.SHOP_DEMO };
  const set = (k: "NODE_ENV" | "SHOP_DEMO", v: string | undefined) => { if (v === undefined) delete process.env[k]; else (process.env as Record<string, string>)[k] = v; };
  try {
    set("NODE_ENV", "production"); set("SHOP_DEMO", "1");
    const a = await startProductCheckout({ productId: "preview-sample-a", locale: "en" });
    const b = await requestDownloadLink({ session: "demo_paid_preview-sample-a", locale: "en" });
    assert.ok(!a.ok && a.error.code === "unavailable");
    assert.ok(!b.ok && b.error.code === "unavailable", "a forged demo session cannot fetch a file in production");
    set("NODE_ENV", "development"); set("SHOP_DEMO", "1");
    assert.ok((await requestDownloadLink({ session: "demo_paid_preview-sample-b", locale: "en" })).ok);
    assert.ok(!(await requestDownloadLink({ session: "demo_failed_preview-sample-b", locale: "en" })).ok);
    set("SHOP_DEMO", undefined);
    assert.ok(!(await requestDownloadLink({ session: "demo_paid_preview-sample-b", locale: "en" })).ok, "demo needs its flag");
  } finally { set("NODE_ENV", env.NODE_ENV); set("SHOP_DEMO", env.SHOP_DEMO); }
});

test("no paid files in a public folder and no permanent file URLs in the source", () => {
  const paid = /\.(pdf|xlsx|docx|pptx|epub|zip)$/i;
  const files: string[] = [];
  const walk = (dir: string) => { for (const f of readdirSync(dir)) { const p = join(dir, f); if (statSync(p).isDirectory()) { if (f !== "node_modules" && f !== ".next" && f !== ".git") walk(p); } else files.push(p); } };
  walk(".");
  assert.deepEqual(files.filter((f) => paid.test(f)), [], "no paid-file types anywhere in the repo");
  if (existsSync("public")) assert.deepEqual(readdirSync("public").filter((f) => paid.test(f)), []);
  const permanent = /https?:\/\/[^\s"'`]+\.(pdf|xlsx|docx|pptx|epub|zip)\b/i;
  const hits = files.filter((f) => /\.(ts|tsx)$/.test(f) && f.startsWith("src") && permanent.test(readFileSync(f, "utf8")));
  assert.deepEqual(hits, []);
});
