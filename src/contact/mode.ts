import { validateContactChannel } from "./validate.ts";
import type { Channel, ContactConfig, ContactMode, ContactProviders, ValidationIssue } from "./types.ts";

export interface ContactModeInput {
  nodeEnv: string | undefined;
  demoFlag: string | undefined;
  channel: Channel;
  /** The real, client-owned configuration (draft until approved). */
  real: ContactConfig;
  /** Installed provider adapters (both null until the client selects providers). */
  providers: ContactProviders;
  /** The demo fixture. Only ever loaded in development; null elsewhere. */
  demo: ContactConfig | null;
}
export interface ContactModeResult { mode: ContactMode; config: ContactConfig; issues: ValidationIssue[] }

/**
 * What a channel shows:
 *  - "live": ONLY a valid, approved, non-demo configuration whose provider for that channel is installed and matches
 *    the configured provider id. Only then may personal data be sent to the server.
 *  - "demo": only when NODE_ENV === "development" AND CONTACT_DEMO === "1" (never in production). The demo is entirely
 *    client-side: nothing is sent, stored or logged, and the UI says so.
 *  - "unavailable": everything else. No form is shown, so no personal data is collected.
 */
export function resolveContactMode({ nodeEnv, demoFlag, channel, real, providers, demo }: ContactModeInput): ContactModeResult {
  const issues = validateContactChannel(real, channel);
  const key = channel === "enquiry" ? "crm" : "newsletter";
  const installed = providers[key];
  if (!installed) issues.push({ code: `${key}-provider-not-installed`, message: `No ${key} adapter is installed.` });
  else if (installed.id !== real.providers[key]) issues.push({ code: `${key}-provider-mismatch`, message: `Installed ${key} adapter does not match the configured id.` });

  if (issues.length === 0) return { mode: "live", config: real, issues };
  if (nodeEnv === "development" && demoFlag === "1" && demo && demo.isDemo) return { mode: "demo", config: demo, issues };
  return { mode: "unavailable", config: real, issues };
}
