import type { APIRoute } from "astro";
import { FEED_LINKS } from "../../lib/links";

export const prerender = true;

export const GET: APIRoute = () => {
  return new Response(
    JSON.stringify(
      {
        name: "License Server Docs MCP",
        description:
          "Read-only MCP server for License Server documentation, agent guide, API reference, and troubleshooting guidance.",
        documentation: FEED_LINKS.mcpDocs,
        static_docs: {
          llms: FEED_LINKS.llms,
          llms_full: FEED_LINKS.llmsFull,
          sitemap: FEED_LINKS.sitemap,
        },
        transports: {
          stdio: {
            command: "bun run mcp",
          },
          http: {
            path: "/mcp",
            note: "Deploy this endpoint to a dynamic host. GitHub Pages is static and cannot run the MCP server.",
          },
        },
      },
      null,
      2,
    ),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    },
  );
};
