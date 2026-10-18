"use client";

import { useEffect, useRef } from "react";
import { track } from "@/analytics/track.ts";
import { analyticsEvents, type AnalyticsEventName } from "@/analytics/types.ts";

/**
 * One delegated click listener for links marked data-track="<event>" (set by ButtonLink). It reads only the marker, never
 * link text, href, form values or anything the visitor typed. Inactive (does nothing) until analytics is configured.
 */
export function AnalyticsEvents() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.("a[data-track]");
      const name = el?.getAttribute("data-track");
      if (name && (analyticsEvents as readonly string[]).includes(name)) track(name as AnalyticsEventName);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}

/** Fires one event when the component first appears (used for scorecard completion). Name only; no result data. */
export function TrackOnMount({ event }: { event: AnalyticsEventName }) {
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    track(event);
  }, [event]);
  return null;
}
