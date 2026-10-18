"use client";

import { useSyncExternalStore } from "react";
import { bookingStore, type BookingState } from "@/booking/store.ts";

export function useBooking(): BookingState {
  return useSyncExternalStore(bookingStore.subscribe, bookingStore.getState, bookingStore.getServerState);
}

/** Set before client-side step navigation so the next step can move focus to its heading (not on first page load). */
let arrivedByNavigation = false;
export const markNavigated = () => { arrivedByNavigation = true; };
export const consumeNavigated = (): boolean => { const v = arrivedByNavigation; arrivedByNavigation = false; return v; };

/**
 * After client-side step navigation, move focus to the step heading. Next.js applies its own focus/scroll handling in a
 * parent effect that runs after this component's effects, so focus is moved on the next frames to win that race reliably.
 * The "arrived by navigation" flag is only consumed when focus actually fires, so React StrictMode's double effect run
 * (mount, cleanup, mount) in development cannot swallow it.
 */
export function focusHeadingAfterNavigation(heading: { current: HTMLElement | null }): () => void {
  if (!arrivedByNavigation) return () => {};
  const focus = () => { if (arrivedByNavigation) { arrivedByNavigation = false; heading.current?.focus(); } };
  let raf2 = 0;
  const raf1 = requestAnimationFrame(() => { raf2 = requestAnimationFrame(focus); });
  const t = window.setTimeout(focus, 120);
  return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); window.clearTimeout(t); };
}
