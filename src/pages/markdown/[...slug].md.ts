import { readFile } from "node:fs/promises";
import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";

export const prerender = true;

type DocsEntryWithFilePath = Awaited<ReturnType<typeof getCollection<"docs">>>[number] & {
  filePath?: string;
};

function getMarkdownSlug(entryId: string) {
  return entryId === "index" ? "index" : entryId;
}

function serializeFrontmatter(data: Record<string, unknown>) {
  const safeData = {
    title: data.title,
    description: data.description,
  };

  const lines = ["---"];
  for (const [key, value] of Object.entries(safeData)) {
    if (typeof value === "string" && value.trim()) {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    }
  }
  lines.push("---", "");

  return lines.join("\n");
}

function stripFrontmatter(source: string) {
  return source.replace(/^---[\s\S]*?---\s*/, "").trim();
}

async function renderEntrySource(entry: DocsEntryWithFilePath) {
  if (entry.filePath) {
    const source = await readFile(entry.filePath, "utf8");
    return source.trim();
  }

  return `${serializeFrontmatter(entry.data)}${stripFrontmatter(entry.body || "")}`.trim();
}

export const getStaticPaths: GetStaticPaths = async () => {
  const entries = (await getCollection("docs")) as DocsEntryWithFilePath[];

  return entries
    .filter((entry) => entry.id !== "404")
    .map((entry) => ({
      params: { slug: getMarkdownSlug(entry.id) },
      props: { entry },
    }));
};

export const GET: APIRoute = async ({ props }) => {
  const entry = props.entry as DocsEntryWithFilePath;
  const source = await renderEntrySource(entry);

  return new Response(`${source}\n`, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex",
    },
  });
};
