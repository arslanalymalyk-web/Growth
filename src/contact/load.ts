import { serviceSlugs } from "../content/catalog.ts";
import { realContact } from "./config.ts";
import { resolveContactMode, type ContactModeResult } from "./mode.ts";
import { installedContactProviders } from "./providers.ts";
import type { ContactConfig, ContactProviders } from "./types.ts";

export interface ContactRuntime {
  enquiry: ContactModeResult;
  newsletter: ContactModeResult;
  /** Server-only. NEVER pass to client components. */
  providers: ContactProviders;
  topics: string[];
}

/**
 * Server-side loader. The demo fixture is imported ONLY when NODE_ENV === "development"; the check is inlined at build
 * time, so it is dead-code-eliminated from production bundles.
 */
export async function getContactRuntime(): Promise<ContactRuntime> {
  let demo: ContactConfig | null = null;
  if (process.env.NODE_ENV === "development") demo = (await import("./demo.ts")).demoContact;
  const base = { nodeEnv: process.env.NODE_ENV, demoFlag: process.env.CONTACT_DEMO, real: realContact, providers: installedContactProviders, demo };
  return {
    enquiry: resolveContactMode({ ...base, channel: "enquiry" }),
    newsletter: resolveContactMode({ ...base, channel: "newsletter" }),
    providers: installedContactProviders,
    topics: serviceSlugs,
  };
}
