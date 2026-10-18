"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { OrderState } from "@/shop/rules.ts";
import type { LProduct } from "@/shop/types.ts";
import type { ShopUi } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { routes } from "@/i18n/routes";
import { Container } from "../ui/Section";
import { DownloadPanel } from "./DownloadPanel";

const btn = "inline-flex min-h-12 items-center justify-center px-6 py-3 text-sm font-semibold tracking-wide transition-colors";
const btnPrimary = `${btn} bg-gold-400 text-navy-950 hover:bg-gold-300`;
const btnOutline = `${btn} border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-ivory-50`;

const tone: Record<OrderState, { box: string; icon: string; mark: string }> = {
  confirmed: { box: "border-gold-500", icon: "text-gold-700", mark: "✓" },
  pending: { box: "border-gold-700", icon: "text-gold-700", mark: "…" },
  failed: { box: "border-alert-700", icon: "text-alert-700", mark: "!" },
  cancelled: { box: "border-ivory-300", icon: "text-ink-muted", mark: "–" },
  "checkout-expired": { box: "border-ivory-300", icon: "text-ink-muted", mark: "⏱" },
  unverified: { box: "border-ivory-300", icon: "text-ink-muted", mark: "?" },
};
const key = (s: OrderState) => (s === "checkout-expired" ? "checkoutExpired" : s) as "confirmed" | "pending" | "failed" | "cancelled" | "checkoutExpired" | "unverified";

/** Confirmation / pending / failed / cancelled / checkout-expired / unverified. The download panel appears ONLY for a provider-verified payment. */
export function OrderStatusView({ state, ui, locale, isDemo, product, session }: { state: OrderState; ui: ShopUi; locale: Locale; isDemo: boolean; product: LProduct | null; session: string | null }) {
  const router = useRouter();
  const o = ui.order;
  const copy = o[key(state)];
  const t = tone[state];
  const retryable = product && (state === "failed" || state === "cancelled" || state === "checkout-expired" || state === "pending");
  return (
    <Container className="py-10 sm:py-14">
      <div role={state === "failed" ? "alert" : "status"} className={`max-w-3xl border-2 bg-ivory-50 p-6 sm:p-10 ${t.box}`}>
        <div className="flex items-start gap-4">
          <span aria-hidden="true" className={`flex size-12 shrink-0 items-center justify-center border-2 border-current text-2xl font-bold ${t.icon}`}>{t.mark}</span>
          <div>
            <h2 className="text-3xl text-navy-900 sm:text-4xl">{copy.title}</h2>
            <p className="mt-3 text-lg text-ink-muted">{copy.body}</p>
            {isDemo && <p className="mt-3 border-s-2 border-gold-700 ps-3 text-sm font-medium text-gold-700">{o.demoNote}</p>}
          </div>
        </div>
      </div>

      {state === "confirmed" && product && session && <DownloadPanel session={session} product={product} ui={ui} locale={locale} isDemo={isDemo} />}

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {retryable && <button type="button" className={btnPrimary} onClick={() => router.push(routes.productCheckout(locale, product.id))}>{o.tryAgain}</button>}
        <Link href={routes.shop(locale)} className={retryable ? btnOutline : btnPrimary}>{o.backToShop}</Link>
        <Link href={routes.home(locale)} className={btnOutline}>{o.home}</Link>
      </div>
    </Container>
  );
}
