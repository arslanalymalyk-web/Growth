/**
 * Business details that are CONFIRMED by the client. Everything not confirmed is null and is therefore never published in
 * structured data or on the page. Do not fill a field from assumption: each one needs written client confirmation, and it
 * must match the Google Business Profile once that is reviewed (see docs/google-business-profile-handover.md).
 */
export interface BusinessProfile {
  /** Brand name as used across the site. Confirmed by the existing site identity. */
  name: string;
  logoUrl: string | null;
  email: string | null;
  telephone: string | null;
  address: { streetAddress: string; addressLocality: string; addressRegion?: string; postalCode?: string; addressCountry: string } | null;
  /** Official profile URLs (LinkedIn, etc.). */
  sameAs: string[];
  /** Only set once the client confirms a named service area. */
  areaServed: string[];
  openingHours: string[];
}

export const confirmedBusiness: BusinessProfile = {
  name: "Growth Blueprint Advisory",
  logoUrl: null,
  email: null,
  telephone: null,
  address: null,
  sameAs: [],
  areaServed: [],
  openingHours: [],
};
