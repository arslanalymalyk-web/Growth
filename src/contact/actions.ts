"use server";

import { getContactRuntime } from "./load.ts";
import { processEnquiry, processSubscription, type EnquiryInput, type NewsletterInput, type SubmitResult } from "./flow.ts";

/**
 * Server actions. They are the ONLY place personal data reaches the server, and they refuse unless the channel is live
 * (approved config + installed provider). They store nothing, log nothing and return only a status. In the development
 * demo the browser never calls them at all.
 */
export async function submitEnquiry(input: EnquiryInput): Promise<SubmitResult<Record<string, never>>> {
  const rt = await getContactRuntime();
  return processEnquiry({ mode: rt.enquiry.mode, config: rt.enquiry.config, providers: rt.providers, topics: rt.topics }, input);
}

export async function subscribeNewsletter(input: NewsletterInput): Promise<SubmitResult<{ status: "subscribed" | "pending-confirmation" }>> {
  const rt = await getContactRuntime();
  return processSubscription({ mode: rt.newsletter.mode, config: rt.newsletter.config, providers: rt.providers, topics: rt.topics }, input);
}
