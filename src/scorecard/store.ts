import type { AnswerValue, Answers } from "./types.ts";

/**
 * In-memory session store for the current browser tab. Answers survive client-side navigation (including language
 * switches and moving between assessment and results) but are NEVER written to localStorage, sessionStorage, cookies,
 * a server, a CRM or analytics. A full page reload clears everything.
 */
export interface ScorecardState {
  answers: Answers;
  consent: { processing: boolean; newsletter: boolean };
  step: number;
  completed: boolean;
}

const initial: ScorecardState = { answers: {}, consent: { processing: false, newsletter: false }, step: 0, completed: false };
let state: ScorecardState = initial;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const set = (next: ScorecardState) => { state = next; emit(); };

export const scorecardStore = {
  getState: (): ScorecardState => state,
  getServerState: (): ScorecardState => initial,
  subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; },
  setAnswer(id: string, value: AnswerValue | undefined) {
    const answers = { ...state.answers };
    if (value === undefined) delete answers[id];
    else answers[id] = value;
    set({ ...state, answers, completed: false });
  },
  setConsent(key: "processing" | "newsletter", value: boolean) { set({ ...state, consent: { ...state.consent, [key]: value } }); },
  setStep(step: number) { set({ ...state, step }); },
  complete() { set({ ...state, completed: true }); },
  reset() { set(initial); },
};
