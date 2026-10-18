import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, hasLocale } from "@/i18n/config";

/** Sends "/" (and locale-less paths) to /en or /ar. Only the homepage and two placeholder routes exist. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";
  if (hasLocale(first)) return NextResponse.next();

  const wantsArabic = /^\s*ar\b/i.test(request.headers.get("accept-language") ?? "");
  const target = request.nextUrl.clone();
  target.pathname = `/${wantsArabic ? "ar" : defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(target);
}

export const config = {
  // Skip Next internals and any path with a file extension (assets).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
