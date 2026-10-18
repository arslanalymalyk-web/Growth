import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { analyticsConfig } from "../src/analytics/config.ts";
import { createAnalytics, sanitizeEvent } from "../src/analytics/core.ts";
import { eventForHref, pageKey } from "../src/analytics/events.ts";
import { installedAnalyticsProvider } from "../src/analytics/providers.ts";
import { analytics } from "../src/analytics/track.ts";
import type { AnalyticsEvent, AnalyticsProvider, ConsentState } from "../src/analytics/types.ts";

const spy = () => { const sent: AnalyticsEvent[] = []; const p: AnalyticsProvider = { id: "test-provider", send: (e) => void sent.push(e) }; return { sent, p }; };
const ev = { name: "booking_cta_click", locale: "en", page: "/services" } as const;

test("nothing is configured: no provider, no consent policy, gate is closed", () => {
  assert.equal(analyticsConfig.providerId, null);
  assert.equal(analyticsConfig.consentPolicy, null);
  assert.equal(installedAnalyticsProvider, null);
  assert.equal(analytics.isActive(), false);
  assert.equal(analytics.track(ev), false);
});

test("closed unless provider, matching id and a defined consent policy all exist", () => {
  const { sent, p } = spy();
  const consent = (): ConsentState => "granted";
  for (const deps of [
    { provider: null, configuredProviderId: "test-provider", policy: "opt-in" as const },
    { provider: p, configuredProviderId: null, policy: "opt-in" as const },
    { provider: p, configuredProviderId: "other", policy: "opt-in" as const },
    { provider: p, configuredProviderId: "test-provider", policy: null }, // consent requirement undefined: stay off even if "granted"
  ]) assert.equal(createAnalytics({ ...deps, consent }).track(ev), false);
  assert.equal(sent.length, 0);
});

test("opt-in policy: nothing before consent, nothing after denial, events after grant", () => {
  const { sent, p } = spy();
  let state: ConsentState = "unknown";
  const a = createAnalytics({ provider: p, configuredProviderId: "test-provider", policy: "opt-in", consent: () => state });
  assert.equal(a.track(ev), false);
  state = "denied"; assert.equal(a.track(ev), false);
  assert.equal(sent.length, 0, "events before consent are dropped, not queued");
  state = "granted"; assert.equal(a.track(ev), true);
  assert.deepEqual(sent, [ev]);
  state = "unknown"; assert.equal(a.track(ev), false);
  assert.equal(sent.length, 1, "nothing sent before the grant is replayed later");
});

test("a client-defined 'not-required' policy allows events without a consent prompt", () => {
  const { sent, p } = spy();
  const a = createAnalytics({ provider: p, configuredProviderId: "test-provider", policy: "not-required", consent: () => "unknown" });
  assert.equal(a.track(ev), true);
  assert.equal(sent.length, 1);
});

test("events are sanitised: unknown names, personal data and extra fields never reach a provider", () => {
  assert.equal(sanitizeEvent({ ...ev, name: "form_submit" }), null);
  assert.equal(sanitizeEvent({ ...ev, page: "/contact?email=a@b.com" }), null);
  assert.equal(sanitizeEvent({ ...ev, page: "/shop/order/confirmation?session=abc" }), null);
  assert.equal(sanitizeEvent({ ...ev, page: "a@b.com" }), null);
  assert.equal(sanitizeEvent({ ...ev, locale: "fr" }), null);
  assert.equal(sanitizeEvent(null), null);
  const clean = sanitizeEvent({ ...ev, email: "a@b.com", message: "secret", score: 91 });
  assert.deepEqual(clean, ev, "extra properties are stripped");
  const { sent, p } = spy();
  createAnalytics({ provider: p, configuredProviderId: "test-provider", policy: "not-required", consent: () => "granted" }).track({ ...ev, email: "a@b.com" });
  assert.deepEqual(Object.keys(sent[0]).sort(), ["locale", "name", "page"]);
});

test("a provider that throws cannot break the page", () => {
  const p: AnalyticsProvider = { id: "x", send: () => { throw new Error("boom"); } };
  assert.equal(createAnalytics({ provider: p, configuredProviderId: "x", policy: "not-required", consent: () => "granted" }).track(ev), false);
});

test("link targets map to the four allowed events only", () => {
  assert.equal(eventForHref("/en/book-consultation"), "booking_cta_click");
  assert.equal(eventForHref("/ar/book-consultation"), "booking_cta_click");
  assert.equal(eventForHref("/en/book-consultation/details"), null);
  assert.equal(eventForHref("/en/readiness-scorecard/assessment"), "scorecard_start");
  assert.equal(eventForHref("/en/readiness-scorecard"), null);
  assert.equal(eventForHref("/en/shop"), "shop_cta_click");
  assert.equal(eventForHref("/en/shop/some-brief"), "shop_cta_click");
  assert.equal(eventForHref("/en/shop/order/confirmation"), null);
  assert.equal(eventForHref("/en/contact"), null);
  assert.equal(pageKey("/ar/shop/brief?x=1#y"), "/shop/brief");
  assert.equal(pageKey("/en"), "/");
});

function* walk(dir: string): Generator<string> {
  for (const f of readdirSync(dir)) { const p = join(dir, f); if (statSync(p).isDirectory()) yield* walk(p); else yield p; }
}
test("source guard: no tracking scripts, network calls or storage anywhere in the analytics code or components", () => {
  const files = [...walk("src/analytics"), ...walk("src/components/analytics")];
  for (const f of files) {
    const t = readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    assert.ok(!/\b(gtag|dataLayer|fbq|_paq|plausible|posthog|mixpanel|segment|hotjar|clarity|googletagmanager|google-analytics)\b/i.test(t), `${f}: named tracker`);
    assert.ok(!/\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|document\.cookie|indexedDB|createElement\(\s*["']script/.test(t), `${f}: network/storage/script injection`);
    assert.ok(!/console\./.test(t), `${f}: logging`);
  }
  const layout = readFileSync("src/app/[lang]/layout.tsx", "utf8");
  assert.ok(!/<script|next\/script/.test(layout), "layout must not load any script");
});
