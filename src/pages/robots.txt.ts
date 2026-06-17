import type { APIRoute } from "astro";
import { FEED_LINKS } from "../lib/links";

export const prerender = true;

export const GET: APIRoute = () => {
  const body = [
    "User-agent: *",
    "Disallow: /",
    "",
    "# This boilerplate/demo site is intentionally blocked from search indexing.",
    "# For a real project, update this file to allow crawling and expose the sitemap.",
    "# Example production values:",
    "# User-agent: *",
    "# Allow: /",
    `# Sitemap: ${FEED_LINKS.sitemap}`,
    "",
    "# LLM-friendly content endpoints, disabled here for crawler discovery by default:",
    `# ${FEED_LINKS.llms}`,
    `# ${FEED_LINKS.llmsFull}`,
  ].join("\n");

  return new Response(`${body}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
