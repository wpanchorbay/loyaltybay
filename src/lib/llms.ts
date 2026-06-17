import { getCollection } from "astro:content";
import { buildAbsoluteUrl } from "../../site-config.mjs";
import { FEED_LINKS } from "./links";

type LLMDocEntry = {
  title: string;
  description: string;
  url: string;
  body: string;
};

export async function getDocsForLlms(): Promise<LLMDocEntry[]> {
  const entries = await getCollection("docs");

  return entries
    .filter((entry) => entry.id !== "404")
    .map((entry) => ({
      title: entry.data.title,
      description: entry.data.description || "",
      url: buildAbsoluteUrl(entry.id === "index" ? "/" : `/${entry.id}/`),
      body: (entry.body || "").trim(),
    }))
    .sort((a, b) => a.url.localeCompare(b.url));
}

export function renderLlmsIndex(entries: LLMDocEntry[]) {
  const lines = [
    "# License Server Documentation",
    "",
    `Canonical: ${FEED_LINKS.canonical}`,
    `Full documentation export: ${FEED_LINKS.llmsFull}`,
    "",
    "## Docs Index",
    "",
  ];

  for (const entry of entries) {
    lines.push(`- ${entry.title}: ${entry.url}`);
    if (entry.description) {
      lines.push(`  ${entry.description}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

export function renderLlmsFull(entries: LLMDocEntry[]) {
  const lines = [
    "# License Server Documentation",
    "",
    `Canonical: ${FEED_LINKS.canonical}`,
    "",
    "This file contains the main public documentation content in a machine-readable text format.",
    "",
  ];

  for (const entry of entries) {
    lines.push(`## ${entry.title}`);
    lines.push(`URL: ${entry.url}`);
    if (entry.description) {
      lines.push(`Description: ${entry.description}`);
    }
    lines.push("");
    lines.push(entry.body);
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}
