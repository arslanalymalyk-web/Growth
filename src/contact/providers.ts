import type { ContactProviders } from "./types.ts";

/**
 * CONTACT PROVIDER ADAPTERS. None are installed: the client has not selected a CRM or a newsletter platform, so nothing
 * here names one or maps fields to one. To connect them later:
 *   - implement CrmProvider and/or NewsletterProvider (types.ts) in server-only modules that read their credentials from
 *     server environment variables (never NEXT_PUBLIC_*, never committed), translate the canonical record to the provider's
 *     fields, and NEVER log record contents, email addresses or provider responses that contain them,
 *   - export them here and set `providers.crm` / `providers.newsletter` in config.ts to the same ids.
 * Submissions must not be stored in files, browser storage or any database the client has not approved.
 */
export const installedContactProviders: ContactProviders = { crm: null, newsletter: null };
