"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/booking/rules.ts";
import { startProductCheckout } from "@/shop/actions.ts";
import { checkEmail, formatFileSize } from "@/shop/rules.ts";
import type { LProduct, LocalizedShop } from "@/shop/types.ts";
import type { ShopUi } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { routes } from "@/i18n/routes";
import { ErrorSummary, type ErrorItem } from "../ui/ErrorSummary";
import { Container } from "../ui/Section";

type Handoff = "idle" | "preparing" | "error" | "not-enabled" | "cancelled";
const btn = "inline-flex min-h-12 items-center justify-center px-6 py-3 text-sm font-semibold tracking-wide transition-colors";
const btnPrimary = `${btn} bg-gold-400 text-navy-950 hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-60`;
const btnOutline = `${btn} border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-ivory-50`;
const card = "flex min-h-12 cursor-pointer items-start gap-3 border border-ivory-300 bg-ivory-50 p-4 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-gold-400";
/** Only same-site paths or https URLs may be used as a checkout destination (never javascript:/data: etc.). */
const safeDestination = (u: string) => (u.startsWith("/") && !u.startsWith("//")) || /^https:\/\//i.test(u);

/**
 * Buyer details + consents + handoff to the provider's hosted checkout. No card fields. Nothing is sent, stored or
 * recorded here: the only server call (demo) carries a product id and locale, never the buyer's details.
 */
export function CheckoutForm({ product, ui, locale, terms }: { product: LProduct; ui: ShopUi; locale: Locale; terms: LocalizedShop["terms"] }) {
  const router = useRouter();
  const c = ui.checkout;
  const [email, setEmail] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptComms, setAcceptComms] = useState(false);
  const [marketing, setMarketing] = useState(false); // optional, separate, never pre-ticked
  const [attempt, setAttempt] = useState(0);
  const [errors, setErrors] = useState<{ email?: "required" | "invalid" | "too-long"; terms?: boolean; comms?: boolean }>({});
  const [handoff, setHandoff] = useState<Handoff>("idle");
  const token = useRef(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); }, []);

  const price = formatPrice(product.price, locale);
  const emailMsg = errors.email === "required" ? c.errors.emailRequired : errors.email === "invalid" ? c.errors.emailInvalid : errors.email === "too-long" ? c.errors.emailTooLong : "";
  const items: ErrorItem[] = [
    ...(errors.email ? [{ key: "email", text: emailMsg, onSelect: () => document.getElementById("buyer-email")?.focus() }] : []),
    ...(errors.terms ? [{ key: "terms", text: c.errors.terms, onSelect: () => document.getElementById("accept-terms")?.focus() }] : []),
    ...(errors.comms ? [{ key: "comms", text: c.errors.comms, onSelect: () => document.getElementById("accept-comms")?.focus() }] : []),
  ];

  const start = async () => {
    const e = { email: checkEmail(email) ?? undefined, terms: !acceptTerms, comms: !acceptComms };
    setErrors({ email: e.email, terms: e.terms || undefined, comms: e.comms || undefined });
    if (e.email || e.terms || e.comms) { setAttempt((n) => n + 1); return; }
    const mine = ++token.current;
    setHandoff("preparing");
    try {
      const r = await startProductCheckout({ productId: product.id, locale });
      if (mine !== token.current) return; // cancelled while waiting
      if (!r.ok) { setHandoff(r.error.code === "not-enabled" ? "not-enabled" : "error"); return; }
      if (!safeDestination(r.value.checkoutUrl)) { setHandoff("error"); return; }
      if (r.value.checkoutUrl.startsWith("/")) router.push(r.value.checkoutUrl); // same-site (demo simulator)
      else window.location.assign(r.value.checkoutUrl); // provider's hosted checkout page
    } catch {
      if (mine === token.current) setHandoff("error");
    }
  };

  const busy = handoff === "preparing";
  const fieldErr = (id: string, text: string) => <p id={id} className="mt-2 border-s-4 border-alert-700 bg-alert-100 p-2 text-sm font-medium text-alert-700">{text}</p>;

  return (
    <Container className="py-10 sm:py-14">
      <h2 id="checkout-title" ref={headingRef} tabIndex={-1} className="text-3xl text-navy-900 outline-none sm:text-4xl">{c.title}</h2>
      <p className="mt-2 text-ink-muted">{c.intro}</p>
      <p className="mt-2 text-sm text-ink-muted">{c.localNote}</p>
      <div className="mt-8"><ErrorSummary title={c.errors.title} hint={c.errors.hint} items={items} attempt={attempt} /></div>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <section aria-labelledby="order-summary-title">
          <h3 id="order-summary-title" className="mb-4 text-2xl text-navy-900">{c.summary}</h3>
          <dl className="divide-y divide-ivory-300 border border-ivory-300 bg-ivory-50 px-5">
            <div className="py-4"><dt className="text-sm text-ink-muted">{c.brief}</dt><dd className="mt-1 text-xl text-navy-900">{product.title}</dd></div>
            {product.file && <div className="py-4"><dt className="text-sm text-ink-muted">{c.format}</dt><dd className="mt-1 text-navy-900">{ui.formats[product.file.format]} · <span dir="ltr" className="inline-block">{formatFileSize(product.file.sizeBytes, locale)}</span></dd></div>}
            <div className="py-4"><dt className="text-sm text-ink-muted">{c.delivery}</dt><dd className="mt-1 text-navy-900">{c.deliveryValue}</dd></div>
            <div className="py-4">
              <dt className="text-sm text-ink-muted">{c.price}</dt>
              <dd className="mt-1 text-lg font-semibold text-navy-900">
                {price ? <span dir="ltr" className="inline-block">{price}</span> : c.priceTbc}
                {price && product.isPreview && <span className="mt-1 block border-s-2 border-gold-700 ps-2 text-sm font-medium text-gold-700">{ui.demo.price}</span>}
              </dd>
            </div>
          </dl>
          <p className="mt-6"><Link href={routes.product(locale, product.id)} className="inline-flex min-h-11 items-center text-sm font-semibold text-gold-700 underline hover:text-navy-900">{c.back}</Link></p>
        </section>

        <form noValidate onSubmit={(e) => { e.preventDefault(); void start(); }} aria-labelledby="checkout-title">
          <div>
            <label htmlFor="buyer-email" className="block text-lg font-medium text-navy-900">{c.email}<span className="ms-2 inline-block border border-navy-900 px-1.5 py-0.5 align-middle text-xs font-semibold text-navy-900">{c.required}</span></label>
            <p id="buyer-email-help" className="mt-1 text-sm text-ink-muted">{c.emailHelp}</p>
            <input id="buyer-email" name="email" type="email" dir="ltr" autoComplete="email" value={email} aria-required="true" aria-invalid={errors.email ? true : undefined} aria-describedby={`buyer-email-help${errors.email ? " buyer-email-error" : ""}`}
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((x) => ({ ...x, email: undefined })); }} className="mt-2 block min-h-12 w-full border border-ivory-300 bg-ivory-50 px-3 py-2 text-base text-ink" />
            {errors.email && fieldErr("buyer-email-error", emailMsg)}
          </div>

          <fieldset className="mt-8 border border-ivory-300 bg-ivory-50 p-5">
            <legend className="px-2 text-xl text-navy-900">{c.consentTitle}</legend>
            <div className="space-y-4">
              <div>
                <label className={card}>
                  <input id="accept-terms" type="checkbox" checked={acceptTerms} aria-required="true" aria-invalid={errors.terms || undefined} aria-describedby={errors.terms ? "terms-error" : undefined}
                    onChange={(e) => { setAcceptTerms(e.target.checked); if (e.target.checked) setErrors((x) => ({ ...x, terms: undefined })); }} className="mt-1 size-5 shrink-0 accent-navy-900" />
                  <span><span className="me-2 border border-navy-900 px-1.5 py-0.5 text-xs font-semibold text-navy-900">{c.required}</span>{product.licence && product.refund ? c.termsAccept : c.termsPlaceholder}</span>
                </label>
                {errors.terms && fieldErr("terms-error", c.errors.terms)}
              </div>
              <div>
                <label className={card}>
                  <input id="accept-comms" type="checkbox" checked={acceptComms} aria-required="true" aria-invalid={errors.comms || undefined} aria-describedby={errors.comms ? "comms-error" : undefined}
                    onChange={(e) => { setAcceptComms(e.target.checked); if (e.target.checked) setErrors((x) => ({ ...x, comms: undefined })); }} className="mt-1 size-5 shrink-0 accent-navy-900" />
                  <span><span className="me-2 border border-navy-900 px-1.5 py-0.5 text-xs font-semibold text-navy-900">{c.required}</span>{terms.purchaseCommunications ?? c.commsPlaceholder}</span>
                </label>
                {errors.comms && fieldErr("comms-error", c.errors.comms)}
              </div>
              {/* Marketing consent: optional, separate from the order, never pre-ticked, and never required to buy. */}
              <label className={card}>
                <input id="accept-marketing" type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-1 size-5 shrink-0 accent-navy-900" />
                <span><span className="me-2 border border-ivory-300 px-1.5 py-0.5 text-xs font-semibold text-ink-muted">{c.optional}</span>{terms.marketingConsent ?? c.marketingPlaceholder}</span>
              </label>
            </div>
            <p className="mt-4 text-sm text-ink-muted">{terms.privacy ?? c.privacyPending}</p>
          </fieldset>

          <div className="mt-6 space-y-1 border-s-2 border-gold-500 ps-3 text-sm text-ink-muted">
            <p>{c.hosted}</p>
            <p className="font-medium text-navy-900">{c.noCard}</p>
          </div>

          <div className="mt-6" aria-live="polite">
            {busy && <p role="status" className="mb-3 flex items-center gap-3 text-navy-900"><span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-navy-900 border-t-transparent" />{c.preparing}</p>}
            {handoff === "error" && <p role="alert" className="mb-3 border-s-4 border-alert-700 bg-alert-100 p-3 text-sm font-medium text-alert-700">{c.handoffError}</p>}
            {handoff === "not-enabled" && <p role="alert" className="mb-3 border-s-4 border-alert-700 bg-alert-100 p-3 text-sm font-medium text-alert-700">{c.notEnabled}</p>}
            {handoff === "cancelled" && <p role="status" className="mb-3 border-s-4 border-gold-700 bg-ivory-200 p-3 text-sm font-medium text-navy-950">{c.cancelledNote}</p>}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button type="submit" className={btnPrimary} disabled={busy} aria-busy={busy}>{handoff === "error" || handoff === "cancelled" ? c.retry : c.continue}</button>
            {busy && <button type="button" className={btnOutline} onClick={() => { token.current++; setHandoff("cancelled"); }}>{c.cancel}</button>}
          </div>
        </form>
      </div>
    </Container>
  );
}
