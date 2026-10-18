"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { requestDownloadLink } from "@/shop/actions.ts";
import { formatDuration, formatFileSize } from "@/shop/rules.ts";
import type { LProduct } from "@/shop/types.ts";
import type { ShopUi } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { fill } from "@/i18n/format";
import { routes } from "@/i18n/routes";

type View =
  | { kind: "idle" }
  | { kind: "preparing" }
  | { kind: "ready"; url: string; deadline: number }
  | { kind: "expired" }
  | { kind: "error"; code: string };

const btn = "inline-flex min-h-12 items-center justify-center px-6 py-3 text-sm font-semibold tracking-wide transition-colors";
const btnPrimary = `${btn} bg-gold-400 text-navy-950 hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-60`;
const btnOutline = `${btn} border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-ivory-50`;
/** Only same-site paths or https URLs may be used as a download destination. */
const safe = (u: string) => (u.startsWith("/") && !u.startsWith("//")) || /^https:\/\//i.test(u);

/**
 * Secure download: each click asks the SERVER for a fresh, short-lived signed link (the server re-verifies the payment
 * and the order). The browser never sees a permanent file URL or the private file key. When the link's lifetime ends the
 * UI says so and offers a new link or an emailed one.
 */
export function DownloadPanel({ session, product, ui, locale, isDemo }: { session: string; product: LProduct; ui: ShopUi; locale: Locale; isDemo: boolean }) {
  const d = ui.download;
  const [view, setView] = useState<View>({ kind: "idle" });
  const [left, setLeft] = useState(0);
  const token = useRef(0);

  useEffect(() => {
    if (view.kind !== "ready") return;
    const tick = () => {
      const s = Math.ceil((view.deadline - Date.now()) / 1000);
      if (s <= 0) setView({ kind: "expired" }); else setLeft(s);
    };
    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
  }, [view]);

  const get = async () => {
    const mine = ++token.current;
    setView({ kind: "preparing" });
    try {
      const r = await requestDownloadLink({ session, locale });
      if (mine !== token.current) return;
      if (!r.ok) return setView({ kind: "error", code: r.error.code });
      if (!safe(r.value.url)) return setView({ kind: "error", code: "provider-error" });
      const deadline = Date.parse(r.value.expiresAt);
      setLeft(Math.max(1, Math.ceil((deadline - Date.now()) / 1000)));
      setView({ kind: "ready", url: r.value.url, deadline });
    } catch {
      if (mine === token.current) setView({ kind: "error", code: "provider-error" });
    }
  };

  const errText = view.kind === "error" ? (view.code === "not-paid" ? d.errors.notPaid : view.code === "limit-reached" ? d.errors.limit : view.code === "unavailable" || view.code === "not-enabled" ? d.errors.unavailable : d.errors.generic) : "";
  const fileLabel = product.file ? fill(d.file, { format: ui.formats[product.file.format], size: formatFileSize(product.file.sizeBytes, locale) }) : "";

  return (
    <section aria-labelledby="download-title" className="mt-10 max-w-3xl border border-gold-500 bg-ivory-50 p-6 sm:p-8">
      <h3 id="download-title" className="text-2xl text-navy-900">{d.title}</h3>
      <p className="mt-2 text-ink-muted">{d.intro}</p>
      <p className="mt-4 text-navy-900"><span className="font-semibold">{product.title}</span>{fileLabel && <span className="block text-sm text-ink-muted">{fileLabel}</span>}</p>
      {isDemo && <p className="mt-2 border-s-2 border-gold-700 ps-2 text-sm font-medium text-gold-700">{ui.demo.file}</p>}

      <div className="mt-6" aria-live="polite">
        {view.kind === "preparing" && <p role="status" className="flex items-center gap-3 text-navy-900"><span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-navy-900 border-t-transparent" />{d.preparing}</p>}
        {view.kind === "error" && <p role="alert" className="mb-3 border-s-4 border-alert-700 bg-alert-100 p-3 text-sm font-medium text-alert-700">{errText}</p>}
        {view.kind === "ready" && (
          <div>
            <p role="status" className="font-semibold text-navy-900">{d.ready}</p>
            <p role="timer" className="mt-1 text-sm text-ink-muted">{fill(d.expiresIn, { time: formatDuration(left, locale) })}</p>
          </div>
        )}
        {view.kind === "expired" && (
          <div role="status" className="border-s-4 border-gold-700 bg-ivory-200 p-4">
            <p className="font-semibold text-navy-950">{d.expired.title}</p>
            <p className="mt-1 text-sm text-ink-muted">{d.expired.body}</p>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {view.kind === "ready" ? (
          <a href={view.url} download rel="noreferrer" className={btnPrimary}>{d.open}</a>
        ) : (
          <button type="button" className={btnPrimary} disabled={view.kind === "preparing"} aria-busy={view.kind === "preparing"} onClick={() => void get()}>
            {view.kind === "expired" ? d.getNew : view.kind === "error" ? d.errors.retry : d.get}
          </button>
        )}
        {(view.kind === "expired" || view.kind === "ready") && <Link href={routes.shopOrder(locale, "resend")} className={btnOutline}>{d.resendLink}</Link>}
      </div>
      <p className="mt-4 text-xs text-ink-muted">{d.note}</p>
    </section>
  );
}
