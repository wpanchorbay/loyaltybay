/**
 * Centralized links registry.
 *
 * All hyperlinks and resource URLs used across this project should reference
 * the constants exported from this file rather than being hardcoded inline.
 *
 * Groups:
 *   EXTERNAL_LINKS – third-party / outbound URLs
 *   PAGE_LINKS     – internal page paths (site-relative, includes BASE_PATH)
 *   ASSET_LINKS    – static asset paths   (site-relative, includes BASE_PATH)
 *   FEED_LINKS     – full absolute URLs for machine-readable resources
 *
 * NOTE: YAML frontmatter in .md/.mdx files cannot reference JS expressions,
 * so any link that lives purely in frontmatter remains a plain string there.
 * Those values are annotated with a comment referencing the matching constant
 * so they stay easy to find and update in lock-step.
 */

import {
  BASE_PATH,
  ICON_HREF,
  OG_IMAGE_HREF,
  REPO_URL,
  WPANCHORBAY_URL,
  WPANCHORBAY_PROJECT_LANDING_URL,
  buildAbsoluteUrl,
} from "../../site-config.mjs";

// ---------------------------------------------------------------------------
// External (third-party) URLs
// ---------------------------------------------------------------------------

export const EXTERNAL_LINKS = {
  /** WPAnchorBay main website */
  wpAnchorBay: WPANCHORBAY_URL,

  /** Project-specific WPAnchorBay landing page */
  wpAnchorBayProjectLanding: WPANCHORBAY_PROJECT_LANDING_URL,

  /** GitHub repository for this documentation project */
  githubRepo: REPO_URL,

  /** Astro framework website */
  astro: "https://astro.build/",

  /** Starlight official getting-started guide */
  starlightGettingStarted: "https://starlight.astro.build/getting-started/",
} as const;

// ---------------------------------------------------------------------------
// Internal page paths  (site-relative; include the base path)
// ---------------------------------------------------------------------------

export const PAGE_LINKS = {
  /** Documentation home */
  home: `${BASE_PATH}/`,

  /** Getting Started – Installation */
  installation: `${BASE_PATH}/getting-started/installation/`,

  /** Getting Started – Initial Setup */
  initialSetup: `${BASE_PATH}/getting-started/initial-setup/`,

  /** Features – Earning Points */
  earningPoints: `${BASE_PATH}/features/earning-points/`,

  /** Features – Redeeming Points */
  redeemingPoints: `${BASE_PATH}/features/redeeming-points/`,

  /** Features – VIP Tiers */
  vipTiers: `${BASE_PATH}/features/vip-tiers/`,

  /** Features – Referral Program */
  referralProgram: `${BASE_PATH}/features/referral-program/`,

  /** Features – Points Expiry */
  pointsExpiry: `${BASE_PATH}/features/points-expiry/`,

  /** Features – Customer Dashboard */
  customerDashboard: `${BASE_PATH}/features/customer-dashboard/`,

  /** Admin Guide – Points Ledger */
  pointsLedger: `${BASE_PATH}/admin/points-ledger/`,

  /** Admin Guide – Manual Adjustments */
  manualAdjustments: `${BASE_PATH}/admin/manual-adjustments/`,

  /** Admin Guide – Settings Reference */
  settingsReference: `${BASE_PATH}/admin/settings-reference/`,

  /** Developer Reference – REST API */
  restApi: `${BASE_PATH}/developers/rest-api/`,

  /** Developer Reference – Hooks & Filters */
  hooksAndFilters: `${BASE_PATH}/developers/hooks-and-filters/`,

  /** Developer Reference – Database Schema */
  databaseSchema: `${BASE_PATH}/developers/database-schema/`,

  /** Resources – FAQ */
  faq: `${BASE_PATH}/resources/faq/`,

  /** Resources – Troubleshooting */
  troubleshooting: `${BASE_PATH}/resources/troubleshooting/`,

  /** Resources – Changelog */
  changelog: `${BASE_PATH}/resources/changelog/`,
} as const;

// ---------------------------------------------------------------------------
// Static asset paths (site-relative; include the base path)
// ---------------------------------------------------------------------------

export const ASSET_LINKS = {
  /** Site favicon and navbar logo icon (SVG) */
  icon: ICON_HREF,

  /** OpenGraph share image (PNG) */
  ogImage: OG_IMAGE_HREF,
} as const;

// ---------------------------------------------------------------------------
// Machine-readable / feed resources (full absolute URLs)
// ---------------------------------------------------------------------------

export const FEED_LINKS = {
  /** Canonical root URL */
  canonical: buildAbsoluteUrl("/"),

  /** Absolute URL of the OpenGraph share image */
  ogImage: buildAbsoluteUrl("/assets/WPAnchorBay-Documentation-OG.png"),

  /** XML sitemap index */
  sitemap: buildAbsoluteUrl("/sitemap-index.xml"),

  /** LLM-friendly documentation index */
  llms: buildAbsoluteUrl("/llms.txt"),

  /** LLM-friendly full documentation */
  llmsFull: buildAbsoluteUrl("/llms-full.txt"),

  /** MCP server documentation page */
  mcpDocs: buildAbsoluteUrl("/agents/mcp-server/"),
} as const;
