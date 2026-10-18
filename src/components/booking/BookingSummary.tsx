"use client";

import type { BookingUi } from "@/content/types";
import { formatDateTime, timeZoneLabel } from "@/booking/calendar.ts";
import { formatPrice } from "@/booking/rules.ts";
import type { LPackage, Slot } from "@/booking/types.ts";
import type { Locale } from "@/i18n/config";
import { fill } from "@/i18n/format";

interface Props {
  ui: BookingUi;
  locale: Locale;
  pkg: LPackage;
  slots: (Slot | null)[];
  isDemo: boolean;
  /** Extra rows, e.g. the visitor's name and email on the checkout step. */
  children?: React.ReactNode;
}

/** Selected package, price status, sessions and time zone. Price is a number ONLY if the client supplied one. */
export function BookingSummary({ ui, locale, pkg, slots, isDemo, children }: Props) {
  const price = formatPrice(pkg.price, locale);
  const c = ui.checkout;
  return (
    <dl className="divide-y divide-ivory-300 border border-ivory-300 bg-ivory-50 px-5">
      <div className="py-4">
        <dt className="text-sm text-ink-muted">{c.package}</dt>
        <dd className="mt-1 text-xl text-navy-900">{pkg.name}</dd>
      </div>
      <div className="py-4">
        <dt className="text-sm text-ink-muted">{c.price}</dt>
        <dd className="mt-1 text-lg text-navy-900">
          {price ? <span dir="ltr" className="inline-block">{price}</span> : c.priceTbc}
          {price && isDemo && <span className="mt-1 block border-s-2 border-gold-700 ps-2 text-sm font-medium text-gold-700">{ui.demo.price}</span>}
        </dd>
      </div>
      <div className="py-4">
        <dt className="text-sm text-ink-muted">{c.sessions}</dt>
        <dd className="mt-1">
          <ol className="space-y-1">
            {slots.map((s, i) => s && <li key={s.id}><span className="font-medium text-navy-900">{fill(c.session, { n: i + 1 })}:</span> {formatDateTime(s.startsAt, locale)}</li>)}
          </ol>
        </dd>
      </div>
      <div className="py-4">
        <dt className="text-sm text-ink-muted">{c.timeZone}</dt>
        <dd className="mt-1 text-navy-900"><span dir="ltr" className="inline-block">{timeZoneLabel(locale)}</span></dd>
      </div>
      {children}
    </dl>
  );
}
