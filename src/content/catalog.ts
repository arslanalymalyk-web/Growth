import type { IconName } from "./types";

/**
 * Structural catalogue shared by both languages: ids, URL slugs, icons, grouping and relations.
 * Slugs are fixed here so /en and /ar always have matching pages (the language switch relies on this).
 * CMS entries (Sanity) must use these ids as their slug; copy is what editors change.
 * Contains no marketing copy, so it is safe to import from client components.
 */
export type ServiceGroup = "enter" | "grow";

export interface ServiceCatalogEntry {
  id: string; // also the URL slug
  icon: IconName;
  group: ServiceGroup;
  relatedIds: string[];
}

export const serviceCatalog: ServiceCatalogEntry[] = [
  { id: "market-entry-advisory", icon: "search", group: "enter", relatedIds: ["regulatory-licensing-support", "local-partner-identification", "business-setup-support"] },
  { id: "regulatory-licensing-support", icon: "document", group: "enter", relatedIds: ["market-entry-advisory", "business-setup-support", "local-partner-identification"] },
  { id: "local-partner-identification", icon: "network", group: "enter", relatedIds: ["market-entry-advisory", "business-setup-support", "go-to-market-strategy"] },
  { id: "business-setup-support", icon: "gear", group: "enter", relatedIds: ["regulatory-licensing-support", "operational-setup-advisory", "talent-organisation-advisory"] },
  { id: "go-to-market-strategy", icon: "users", group: "grow", relatedIds: ["market-entry-advisory", "operational-setup-advisory", "ongoing-growth-advisory"] },
  { id: "operational-setup-advisory", icon: "chart", group: "grow", relatedIds: ["business-setup-support", "talent-organisation-advisory", "ongoing-growth-advisory"] },
  { id: "talent-organisation-advisory", icon: "leaf", group: "grow", relatedIds: ["operational-setup-advisory", "business-setup-support", "ongoing-growth-advisory"] },
  { id: "ongoing-growth-advisory", icon: "nodes", group: "grow", relatedIds: ["go-to-market-strategy", "operational-setup-advisory", "talent-organisation-advisory"] },
];

export const industryCatalog: { id: string }[] = [
  { id: "fmcg-consumer-brands" },
  { id: "real-estate" },
  { id: "hospitality" },
  { id: "industry-manufacturing" },
  { id: "technology-digital-businesses" },
  { id: "construction-engineering" },
  { id: "healthcare-life-sciences" },
  { id: "logistics-supply-chain" },
  { id: "retail-ecommerce" },
  { id: "professional-business-services" },
  { id: "tourism-leisure" },
];

export const serviceSlugs: string[] = serviceCatalog.map((s) => s.id);
export const industrySlugs: string[] = industryCatalog.map((s) => s.id);
