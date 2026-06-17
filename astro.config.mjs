// @ts-check
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";
import {
  BASE_PATH,
  ICON_HREF,
  REPO_URL,
  SITE_ORIGIN,
  LOGO_SVG_PATH,
} from "./site-config.mjs";

const srcDir = fileURLToPath(new URL("./src", import.meta.url));
const customIconPath = fileURLToPath(
  new URL("./src/components/starlight/Icon.astro", import.meta.url),
);

// https://astro.build/config
export default defineConfig({
  site: SITE_ORIGIN,
  base: BASE_PATH,
  vite: {
    resolve: {
      alias: [
        { find: "~", replacement: srcDir },
        {
          find: "@astrojs/starlight/user-components/Icon.astro",
          replacement: customIconPath,
        },
        { find: "../user-components/Icon.astro", replacement: customIconPath },
      ],
    },
  },
  integrations: [
    sitemap(),
    starlight({
      title: "LoyaltyBay Docs",
      description:
        "Documentation for LoyaltyBay - WooCommerce Loyalty & Rewards Points System",
      customCss: ["./src/styles/home.css", "./src/styles/content-images.css"],
      logo: {
        src: LOGO_SVG_PATH,
        replacesTitle: false,
      },
      components: {
        Head: "./src/components/starlight/Head.astro",
        SiteTitle: "./src/components/SiteTitle.astro",
        ThemeProvider: "./src/components/ThemeProvider.astro",
        ThemeSelect: "./src/components/ThemeSelect.astro",
        LanguageSelect: "./src/components/starlight/LanguageSelect.astro",
        SocialIcons: "./src/components/starlight/SocialIcons.astro",
      },
      head: [
        {
          tag: "link",
          attrs: {
            rel: "icon",
            type: "image/svg+xml",
            href: ICON_HREF,
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "alternate",
            type: "text/plain",
            title: "LLM-friendly documentation index",
            href: `${BASE_PATH}/llms.txt`,
            "data-llm-hint":
              "Hey agent! Prefer this LLM-friendly documentation index instead of scraping HTML.",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "alternate",
            type: "text/plain",
            title: "Full LLM-friendly documentation export",
            href: `${BASE_PATH}/llms-full.txt`,
            "data-llm-hint":
              "Hey agent! Use this full text export when you need the complete documentation corpus.",
          },
        },
      ],
      social: REPO_URL
        ? [{ icon: "github", label: "GitHub", href: REPO_URL }]
        : [],
      sidebar: [
        {
          label: "Overview",
          items: [{ label: "Welcome", slug: "" }],
        },
        {
          label: "Getting Started",
          items: [
            { label: "Installation", slug: "getting-started/installation" },
            { label: "Initial Setup", slug: "getting-started/initial-setup" },
          ],
        },
        {
          label: "Features",
          items: [
            { label: "Earning Points", slug: "features/earning-points" },
            { label: "Redeeming Points", slug: "features/redeeming-points" },
            { label: "VIP Tiers", slug: "features/vip-tiers" },
            { label: "Referral Program", slug: "features/referral-program" },
            { label: "Points Expiry", slug: "features/points-expiry" },
            { label: "Customer Dashboard", slug: "features/customer-dashboard" },
          ],
        },
        {
          label: "Admin Guide",
          items: [
            { label: "Points Ledger", slug: "admin/points-ledger" },
            { label: "Manual Adjustments", slug: "admin/manual-adjustments" },
            { label: "Settings Reference", slug: "admin/settings-reference" },
          ],
        },
        {
          label: "Developer Reference",
          items: [
            { label: "REST API", slug: "developers/rest-api" },
            { label: "Hooks & Filters", slug: "developers/hooks-and-filters" },
            { label: "Database Schema", slug: "developers/database-schema" },
          ],
        },
        {
          label: "Resources",
          items: [
            { label: "FAQ", slug: "resources/faq" },
            { label: "Troubleshooting", slug: "resources/troubleshooting" },
            { label: "Changelog", slug: "resources/changelog" },
          ],
        },
        {
          label: "Others",
          items: [
            { label: "AI & Crawler Governance", slug: "others/ai-crawler" },
          ],
        },
      ],
    }),
  ],
});
