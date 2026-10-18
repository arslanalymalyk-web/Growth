// Run with: npm run test:contact (Node's built-in test runner; no extra dependencies).
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { serviceSlugs } from "../src/content/catalog.ts";
import { subscribeNewsletter, submitEnquiry } from "../src/contact/actions.ts";
import { enquiryFields, realContact } from "../src/contact/config.ts";
import { demoContact } from "../src/contact/demo.ts";
import { processEnquiry, processSubscription, type FlowDeps } from "../src/contact/flow.ts";
import { resolveContactMode } from "../src/contact/mode.ts";
import { installedContactProviders } from "../src/contact/providers.ts";
import { checkEnquiry, checkSubscriberEmail, fieldsOnStep, isValidEmail } from "../src/contact/rules.ts";
import type { ContactConfig, ContactMode, ContactProviders, CrmProvider, EnquiryRecord, NewsletterProvider, SubscriptionRecord } from "../src/contact/types.ts";
import { validateContactChannel } from "../src/contact/validate.ts";

const clone = <T,>(v: T): T => structuredClone(v);
const txt = { en: "x", ar: "x" };
const codes = (xs: { code: string }[]) => new Set(xs.map((i) => i.code));

/** A complete approved config made ONLY for tests, to prove the validators can pass. Never shipped. */
const approved = (): ContactConfig => ({
  ...clone(realContact),
  id: "test-only", status: "approved", review: { en: "approved", ar: "approved" },
  approval: { approvedBy: "Test Approver", approvedAt: "2000-01-01" },
  privacyNotice: "approved",
  terms: { version: "test-v1", enquiryConsent: txt, newsletterConsent: txt },
  providers: { crm: "test-crm", newsletter: "test-news" },
});

interface Spy { crm: EnquiryRecord[]; news: SubscriptionRecord[] }
const stubs = (spy: Spy, over: { crm?: CrmProvider["createEnquiry"]; news?: NewsletterProvider["subscribe"] } = {}): ContactProviders => ({
  crm: { id: "test-crm", createEnquiry: over.crm ?? (async (r) => { spy.crm.push(r); return { ok: true, value: { reference: "REF" } }; }) },
  newsletter: { id: "test-news", subscribe: over.news ?? (async (r) => { spy.news.push(r); return { ok: true, value: { status: "subscribed" } }; }) },
});
const deps = (mode: ContactMode, providers: ContactProviders, config = approved()): FlowDeps => ({ mode, config, providers, topics: serviceSlugs, now: () => new Date("2030-01-02T03:04:05Z") });
const good = { fullName: "Ada Tester", email: "ada@example.com", organisation: "Test Co", topic: "market-entry-advisory", message: "Please tell me about market entry." };
const input = (over: Record<string, unknown> = {}) => ({ values: good, locale: "en" as const, consent: true, hp: "", ...over }) as never;

test("no CRM or newsletter provider is selected: both channels are unavailable in production", () => {
  assert.deepEqual(installedContactProviders, { crm: null, newsletter: null });
  assert.equal(realContact.status, "draft");
  assert.deepEqual(realContact.providers, { crm: null, newsletter: null });
  assert.equal(realContact.privacyNotice, "pending");
  const e = codes(validateContactChannel(realContact, "enquiry"));
  for (const c of ["not-approved", "no-approval-record", "review-not-approved", "privacy-notice-pending", "consent-version-missing", "consent-missing", "crm-provider-missing"]) assert.ok(e.has(c), `enquiry: ${c}`);
  const n = codes(validateContactChannel(realContact, "newsletter"));
  for (const c of ["privacy-notice-pending", "consent-missing", "newsletter-provider-missing"]) assert.ok(n.has(c), `newsletter: ${c}`);
  for (const channel of ["enquiry", "newsletter"] as const) {
    assert.equal(resolveContactMode({ nodeEnv: "production", demoFlag: undefined, channel, real: realContact, providers: installedContactProviders, demo: null }).mode, "unavailable");
  }
});

test("demo mode only in development with CONTACT_DEMO=1; never live; demo config is flagged", () => {
  const base = { real: realContact, providers: installedContactProviders, demo: demoContact };
  for (const channel of ["enquiry", "newsletter"] as const) {
    for (const [nodeEnv, flag] of [["production", undefined], ["production", "1"], ["test", "1"], [undefined, "1"], ["development", undefined], ["development", "0"]] as const) {
      assert.equal(resolveContactMode({ ...base, channel, nodeEnv, demoFlag: flag }).mode, "unavailable", `${channel} ${nodeEnv}/${flag}`);
    }
    assert.equal(resolveContactMode({ ...base, channel, nodeEnv: "development", demoFlag: "1" }).mode, "demo");
    assert.equal(resolveContactMode({ ...base, channel, demo: null, nodeEnv: "development", demoFlag: "1" }).mode, "unavailable");
  }
  assert.ok(codes(validateContactChannel(demoContact, "enquiry")).has("demo-fixture"));
  assert.ok(codes(validateContactChannel(demoContact, "newsletter")).has("demo-fixture"));
  assert.notEqual(resolveContactMode({ real: demoContact, providers: stubs({ crm: [], news: [] }), demo: null, nodeEnv: "production", demoFlag: "1", channel: "enquiry" }).mode, "live");
});

test("a channel is live only when its config is approved AND its own provider is installed and matches", () => {
  const spy: Spy = { crm: [], news: [] };
  const base = { nodeEnv: "production", demoFlag: undefined, demo: null } as const;
  assert.deepEqual(validateContactChannel(approved(), "enquiry"), []);
  assert.deepEqual(validateContactChannel(approved(), "newsletter"), []);
  assert.equal(resolveContactMode({ ...base, channel: "enquiry", real: approved(), providers: stubs(spy) }).mode, "live");
  assert.equal(resolveContactMode({ ...base, channel: "newsletter", real: approved(), providers: stubs(spy) }).mode, "live");
  // channels are independent
  assert.equal(resolveContactMode({ ...base, channel: "enquiry", real: approved(), providers: { ...stubs(spy), crm: null } }).mode, "unavailable");
  assert.equal(resolveContactMode({ ...base, channel: "newsletter", real: approved(), providers: { ...stubs(spy), crm: null } }).mode, "live", "newsletter does not need a CRM");
  assert.equal(resolveContactMode({ ...base, channel: "newsletter", real: approved(), providers: { ...stubs(spy), newsletter: null } }).mode, "unavailable");
  assert.equal(resolveContactMode({ ...base, channel: "enquiry", real: approved(), providers: { crm: { ...stubs(spy).crm!, id: "other" }, newsletter: null } }).mode, "unavailable");
});

test("each missing approval ingredient blocks activation", () => {
  const cases: [string, (c: ContactConfig) => void, "enquiry" | "newsletter", string][] = [
    ["draft", (c) => { c.status = "draft"; }, "enquiry", "not-approved"],
    ["no approval record", (c) => { c.approval = null; }, "newsletter", "no-approval-record"],
    ["arabic unreviewed", (c) => { c.review.ar = "needs-professional-review"; }, "enquiry", "review-not-approved"],
    ["privacy notice pending", (c) => { c.privacyNotice = "pending"; }, "enquiry", "privacy-notice-pending"],
    ["privacy notice pending (newsletter)", (c) => { c.privacyNotice = "pending"; }, "newsletter", "privacy-notice-pending"],
    ["no consent version", (c) => { c.terms.version = null; }, "enquiry", "consent-version-missing"],
    ["no enquiry consent wording", (c) => { c.terms.enquiryConsent = null; }, "enquiry", "consent-missing"],
    ["enquiry consent missing arabic", (c) => { c.terms.enquiryConsent = { en: "x", ar: "" }; }, "enquiry", "consent-missing"],
    ["no newsletter consent wording", (c) => { c.terms.newsletterConsent = null; }, "newsletter", "consent-missing"],
    ["no crm", (c) => { c.providers.crm = null; }, "enquiry", "crm-provider-missing"],
    ["no newsletter platform", (c) => { c.providers.newsletter = null; }, "newsletter", "newsletter-provider-missing"],
    ["no email field", (c) => { c.fields = c.fields.filter((f) => f.id !== "email"); }, "enquiry", "fields-missing"],
    ["no message field", (c) => { c.fields = c.fields.filter((f) => f.id !== "message"); }, "enquiry", "fields-missing"],
  ];
  for (const [name, mutate, channel, code] of cases) {
    const c = approved(); mutate(c);
    assert.ok(codes(validateContactChannel(c, channel)).has(code), `${name}: expected ${code}`);
  }
  // the newsletter consent being absent must not block the enquiry, and vice versa (separate consents)
  const a = approved(); a.terms.newsletterConsent = null;
  assert.deepEqual(validateContactChannel(a, "enquiry"), []);
  const b = approved(); b.terms.enquiryConsent = null;
  assert.deepEqual(validateContactChannel(b, "newsletter"), []);
});

test("enquiry fields collect only what is needed to respond", () => {
  assert.deepEqual(enquiryFields.map((f) => f.id), ["fullName", "email", "organisation", "topic", "message"]);
  assert.deepEqual(enquiryFields.filter((f) => f.required).map((f) => f.id), ["fullName", "email", "message"]);
  assert.deepEqual(fieldsOnStep(enquiryFields, "about").map((f) => f.id), ["fullName", "email", "organisation"]);
  assert.deepEqual(fieldsOnStep(enquiryFields, "enquiry").map((f) => f.id), ["topic", "message"]);
  assert.ok(!enquiryFields.some((f) => /phone|tel|address|country|budget|iban|card/i.test(f.id)), "no unneeded personal fields");
});

test("field validation: required, invalid, too short/long, injection, topic", () => {
  const run = (values: Record<string, string>) => checkEnquiry(enquiryFields, values, serviceSlugs).map((e) => `${e.fieldId}:${e.code}`);
  assert.deepEqual(run({}), ["fullName:required", "email:required", "message:required"]);
  assert.deepEqual(run(good), []);
  assert.deepEqual(run({ ...good, fullName: "   " }), ["fullName:required"]);
  assert.deepEqual(run({ ...good, email: "nope" }), ["email:invalid"]);
  assert.deepEqual(run({ ...good, email: "a@b" }), ["email:invalid"]);
  assert.deepEqual(run({ ...good, email: "a@b.co\r\nBcc: x@y.z" }), ["email:invalid"], "header injection");
  assert.deepEqual(run({ ...good, fullName: "Ada\nLovelace" }), ["fullName:invalid"], "no line breaks in single-line fields");
  assert.deepEqual(run({ ...good, message: "line one\nline two is fine" }), [], "line breaks allowed in the message");
  assert.deepEqual(run({ ...good, message: "short" }), ["message:too-short"]);
  assert.deepEqual(run({ ...good, message: "x".repeat(2001) }), ["message:too-long"]);
  assert.deepEqual(run({ ...good, fullName: "x".repeat(121) }), ["fullName:too-long"]);
  assert.deepEqual(run({ ...good, topic: "not-a-service" }), ["topic:invalid"]);
  assert.deepEqual(run({ ...good, topic: "general" }), []);
  assert.deepEqual(run({ ...good, topic: "" }), [], "topic is optional");
  assert.deepEqual(run({ ...good, message: "bad\u0000control chars here" }), ["message:invalid"]);
  assert.ok(isValidEmail("ada@example.com") && !isValidEmail("a b@c.de") && !isValidEmail("a@b.c"));
  assert.equal(checkSubscriberEmail(""), "required");
  assert.equal(checkSubscriberEmail("x"), "invalid");
  assert.equal(checkSubscriberEmail("a".repeat(250) + "@b.co"), "too-long");
  assert.equal(checkSubscriberEmail("ada@example.com"), null);
});

test("enquiry submission when UNCONFIGURED or demo: refused, provider never called", async () => {
  const spy: Spy = { crm: [], news: [] };
  const un = await processEnquiry(deps("unavailable", installedContactProviders, realContact), input());
  assert.deepEqual(un, { ok: false, code: "unavailable" });
  const noProvider = await processEnquiry(deps("live", { crm: null, newsletter: null }), input());
  assert.deepEqual(noProvider, { ok: false, code: "unavailable" });
  const demo = await processEnquiry(deps("demo", stubs(spy), demoContact), input());
  assert.deepEqual(demo, { ok: false, code: "not-enabled" }, "demo must never reach a provider or claim success");
  assert.equal(spy.crm.length, 0);
});

test("enquiry submission when CONFIGURED: validated, consent-gated, canonical record only", async () => {
  const spy: Spy = { crm: [], news: [] };
  const ok = await processEnquiry(deps("live", stubs(spy)), input({ values: { ...good, injected: "<script>", website: "x" } }));
  assert.deepEqual(ok, { ok: true, value: {} });
  assert.equal(spy.crm.length, 1);
  assert.deepEqual(spy.crm[0], {
    fullName: "Ada Tester", email: "ada@example.com", organisation: "Test Co", topic: "market-entry-advisory",
    message: "Please tell me about market entry.", locale: "en",
    processingConsent: { given: true, textVersion: "test-v1", at: "2030-01-02T03:04:05.000Z" },
  }, "only configured fields are forwarded, with consent evidence");
  assert.equal(spy.news.length, 0, "an enquiry never subscribes anyone to the newsletter");
  assert.ok(!Object.keys(spy.crm[0]).some((k) => /newsletter|marketing|subscri/i.test(k)));

  // optional fields are omitted, not sent empty
  await processEnquiry(deps("live", stubs(spy)), input({ values: { fullName: "Ada", email: "ada@example.com", message: "A sufficiently long message." }, locale: "ar" }));
  assert.deepEqual(Object.keys(spy.crm[1]).sort(), ["email", "fullName", "locale", "message", "processingConsent"]);
  assert.equal(spy.crm[1].locale, "ar");
});

test("enquiry rejects: missing consent, honeypot, bad fields, bad payload shapes: provider never called", async () => {
  const spy: Spy = { crm: [], news: [] };
  const p = stubs(spy);
  const noConsent = await processEnquiry(deps("live", p), input({ consent: false }));
  assert.ok(!noConsent.ok && noConsent.code === "invalid" && noConsent.consentMissing === true);
  for (const bad of ["true", 1, undefined, null, "yes"]) assert.ok(!(await processEnquiry(deps("live", p), input({ consent: bad }))).ok, `consent=${String(bad)}`);
  const bot = await processEnquiry(deps("live", p), input({ hp: "http://spam" }));
  assert.ok(!bot.ok && bot.code === "invalid");
  const fields = await processEnquiry(deps("live", p), input({ values: { ...good, email: "bad" } }));
  assert.ok(!fields.ok && fields.code === "invalid" && fields.fieldErrors?.[0].fieldId === "email");
  for (const shape of [{ values: [] }, { values: null }, { values: { fullName: 1 } }, { locale: "fr" }, { hp: 5 }]) {
    assert.ok(!(await processEnquiry(deps("live", p), input(shape))).ok, JSON.stringify(shape));
  }
  assert.equal((await processEnquiry(deps("live", p), undefined as never)).ok, false);
  assert.equal(spy.crm.length, 0, "nothing reached the CRM");
});

test("provider failures return a generic code and never echo personal data", async () => {
  const spy: Spy = { crm: [], news: [] };
  const leaky = stubs(spy, { crm: async () => ({ ok: false, error: { code: "provider-error", message: "failed for ada@example.com Please tell me" } }) });
  const r = await processEnquiry(deps("live", leaky), input());
  assert.deepEqual(r, { ok: false, code: "provider-error" });
  assert.ok(!JSON.stringify(r).includes("ada@example.com"));
  const throwing = stubs(spy, { crm: async () => { throw new Error("boom ada@example.com"); } });
  const t = await processEnquiry(deps("live", throwing), input());
  assert.deepEqual(t, { ok: false, code: "provider-error" });
  const nf = stubs(spy, { news: async () => { throw new Error("boom"); } });
  assert.deepEqual(await processSubscription(deps("live", nf), { email: "a@b.co", locale: "en", consent: true, hp: "" }), { ok: false, code: "provider-error" });
});

test("newsletter: separate consent, validated, status passed through; refused when unconfigured/demo", async () => {
  const spy: Spy = { crm: [], news: [] };
  const sub = { email: " Ada@Example.com ", locale: "en" as const, consent: true, hp: "" };
  assert.deepEqual(await processSubscription(deps("unavailable", installedContactProviders, realContact), sub), { ok: false, code: "unavailable" });
  assert.deepEqual(await processSubscription(deps("demo", stubs(spy), demoContact), sub), { ok: false, code: "not-enabled" });
  assert.equal(spy.news.length, 0);
  const ok = await processSubscription(deps("live", stubs(spy)), sub);
  assert.deepEqual(ok, { ok: true, value: { status: "subscribed" } });
  assert.deepEqual(spy.news[0], { email: "Ada@Example.com", locale: "en", subscriptionConsent: { given: true, textVersion: "test-v1", at: "2030-01-02T03:04:05.000Z" } });
  assert.equal(spy.crm.length, 0, "a subscription never creates a CRM enquiry");
  const pending = stubs(spy, { news: async () => ({ ok: true, value: { status: "pending-confirmation" } }) });
  assert.deepEqual(await processSubscription(deps("live", pending), sub), { ok: true, value: { status: "pending-confirmation" } });
  const noConsent = await processSubscription(deps("live", stubs(spy)), { ...sub, consent: false });
  assert.ok(!noConsent.ok && noConsent.consentMissing === true);
  assert.ok(!(await processSubscription(deps("live", stubs(spy)), { ...sub, email: "nope" })).ok);
  assert.ok(!(await processSubscription(deps("live", stubs(spy)), { ...sub, hp: "x" })).ok);
  assert.ok(!(await processSubscription(deps("live", stubs(spy)), { ...sub, locale: "fr" as never })).ok);
  assert.equal(spy.news.length, 1, "only the one valid subscription that used the recording provider reached it; every invalid attempt was stopped before any provider");
});

test("server actions refuse in this stage (no provider is installed) and never report success", async () => {
  const env = { NODE_ENV: process.env.NODE_ENV, CONTACT_DEMO: process.env.CONTACT_DEMO };
  const set = (k: "NODE_ENV" | "CONTACT_DEMO", v: string | undefined) => { if (v === undefined) delete process.env[k]; else (process.env as Record<string, string>)[k] = v; };
  try {
    for (const [nodeEnv, flag, expected] of [["production", "1", "unavailable"], ["production", undefined, "unavailable"], ["development", "1", "unavailable"]] as const) {
      set("NODE_ENV", nodeEnv); set("CONTACT_DEMO", flag);
      const a = await submitEnquiry(input());
      const b = await subscribeNewsletter({ email: "a@b.co", locale: "en", consent: true, hp: "" });
      assert.ok(!a.ok && a.code === expected, `enquiry ${nodeEnv}/${flag}: ${JSON.stringify(a)}`);
      assert.ok(!b.ok && b.code === expected, `newsletter ${nodeEnv}/${flag}`);
    }
  } finally { set("NODE_ENV", env.NODE_ENV); set("CONTACT_DEMO", env.CONTACT_DEMO); }
});

test("source guards: no logging, no local storage, no files or cookies for submissions", () => {
  const files: string[] = [];
  const walk = (dir: string) => { for (const f of readdirSync(dir)) { const p = join(dir, f); if (statSync(p).isDirectory()) walk(p); else if (/\.(ts|tsx)$/.test(f)) files.push(p); } };
  walk("src/contact"); walk("src/components/contact");
  assert.ok(files.length > 8, "guarded files were found");
  const logging = /\bconsole\s*\.\s*(log|info|warn|error|debug|trace)|\bdebugger\b/;
  const storage = /localStorage|sessionStorage|indexedDB|document\.cookie|\bcookies\s*\(|node:fs|from ["']fs["']|writeFile|appendFile|createWriteStream|navigator\.sendBeacon/;
  const external = /\bfetch\s*\(|XMLHttpRequest|axios/;
  for (const f of files) {
    const src = readFileSync(f, "utf8");
    assert.ok(!logging.test(src), `${f} must not log`);
    assert.ok(!storage.test(src), `${f} must not store submissions`);
    assert.ok(!external.test(src), `${f} must not call providers directly (adapters are server-side and added later)`);
  }
});
