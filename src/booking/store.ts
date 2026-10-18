import type { Slot } from "./types.ts";

/**
 * In-memory session store for the current browser tab. Selections and details survive client-side navigation between
 * booking steps but are NEVER written to localStorage, sessionStorage, cookies, a server, a CRM or analytics.
 * A full reload (or leaving the site for a hosted checkout) clears everything.
 */
export interface BookingState {
  packageId: string | null;
  slots: (Slot | null)[];
  details: Record<string, string>;
  consentProcessing: boolean;
  acceptedTerms: boolean;
}
const initial: BookingState = { packageId: null, slots: [], details: {}, consentProcessing: false, acceptedTerms: false };
let state: BookingState = initial;
const listeners = new Set<() => void>();
const set = (next: BookingState) => { state = next; listeners.forEach((l) => l()); };

export const bookingStore = {
  getState: (): BookingState => state,
  getServerState: (): BookingState => initial,
  subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; },
  selectPackage(id: string) { set(id === state.packageId ? state : { ...state, packageId: id, slots: [], acceptedTerms: false }); },
  setSlot(index: number, slot: Slot | null) {
    const slots = [...state.slots];
    slots[index] = slot;
    set({ ...state, slots, acceptedTerms: false });
  },
  clearSlotsFrom(index: number) { set({ ...state, slots: state.slots.slice(0, index), acceptedTerms: false }); },
  setDetail(id: string, value: string) { set({ ...state, details: { ...state.details, [id]: value } }); },
  setConsentProcessing(v: boolean) { set({ ...state, consentProcessing: v }); },
  setAcceptedTerms(v: boolean) { set({ ...state, acceptedTerms: v }); },
  reset() { set(initial); },
};
