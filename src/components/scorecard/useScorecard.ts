"use client";

import { useSyncExternalStore } from "react";
import { scorecardStore, type ScorecardState } from "@/scorecard/store.ts";

export function useScorecard(): ScorecardState {
  return useSyncExternalStore(scorecardStore.subscribe, scorecardStore.getState, scorecardStore.getServerState);
}
