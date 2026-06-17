# Content Authoring Rules

Use this guide when creating or editing documentation content in this Astro Starlight boilerplate.

This file is intentionally separate from `SKILLS.md` so the main agent guide stays focused on project setup, while content rules can grow with examples and authoring patterns.

---

## 1. Official References

Use the official docs when unsure about Starlight syntax, supported components, Astro behavior, or content collection rules:

- Astro docs: https://docs.astro.build/
- Starlight docs: https://starlight.astro.build/
- Starlight components: https://starlight.astro.build/components/using-components/
- Starlight sidebar/navigation: https://starlight.astro.build/guides/sidebar/
- Starlight frontmatter/reference: https://starlight.astro.build/reference/frontmatter/

The project already includes `EXTERNAL_LINKS.astro` and `EXTERNAL_LINKS.starlightGettingStarted` in `src/lib/links.ts`. Add additional official docs links there if they are used in project pages or components.

---

## 2. Frontmatter

Every documentation page must include at least:

````yaml
---
title: Your Page Title
description: A concise SEO-friendly description of this page.
---
````

For the homepage, include complete OpenGraph and Twitter metadata in the `head:` frontmatter block.

---

## 3. Markdown vs MDX

Use `.md` when:

- The page is mostly prose, headings, lists, tables, callouts, and code blocks.
- The page does not need imported components.
- The page should remain as portable and easy for humans/agents to parse as possible.
- You are writing reference docs, troubleshooting docs, API notes, changelogs, migration notes, or simple guides.

Use `.mdx` when:

- The page imports Astro/Starlight/custom components.
- The page uses JSX-like tags such as `<CardGrid>`, `<Card>`, `<Tabs>`, `<Steps>`, `<LinkCard>`, or a project component.
- The page needs custom layout, richer visual blocks, or interactive/structured presentation.
- The page is a special designed page like `index.mdx`, `404.mdx`, or `others/ai-crawler.mdx`.

Keep imports near the top of `.mdx` files after frontmatter. Prefer `.md` by default; upgrade to `.mdx` only when component usage or layout needs justify it.

---

## 4. Components

Use Starlight components in `.mdx` pages when they improve readability:

````mdx
import { Card, CardGrid, Tabs, TabItem, Steps, LinkCard } from '@astrojs/starlight/components';
````

Use the custom homepage card when matching the existing visual style:

````mdx
import Card from '../../components/starlight/Card.astro';
````

---

## 5. Code Blocks

Always specify a syntax-highlighting language:

````markdown
```typescript
const message: string = "Hello, docs!";
```
````

---

## 6. Tabs

Use tabs to display multiple equivalent examples, commands, or variations in a compact and user-friendly way.

Import the tab components at the top of an `.mdx` file:

````mdx
import { Tabs, TabItem } from '@astrojs/starlight/components';
````

Basic example:

````mdx
<Tabs>
  <TabItem label="pnpm">

```sh
pnpm install
```

  </TabItem>

  <TabItem label="Bun">

```sh
bun install
```

  </TabItem>
</Tabs>
````

Use `syncKey` to synchronize matching tab groups across the same page:

````mdx
<Tabs syncKey="package-manager">
  <TabItem label="pnpm">

```sh
pnpm dev
```

  </TabItem>

  <TabItem label="Bun">

```sh
bun run dev
```

  </TabItem>
</Tabs>
````

If the user selects `pnpm` in one tab group, other tab groups with the same `syncKey` switch to `pnpm` automatically.

Common tab use cases:

- Equivalent command examples.
- Framework or library variations.
- Different programming languages.
- OS-specific instructions.
- API request examples.

Tabs rules for this boilerplate:

- Keep labels short and clear.
- Use the same `syncKey` for related command groups.
- Avoid too many tabs in one group.
- Use tabs only for equivalent alternatives, not unrelated content.
- This repository itself uses `pnpm` only. Do not present `npm` or `yarn` as supported setup alternatives for this boilerplate unless the user explicitly asks or the documented target project supports them.

---

## 7. Callouts

Use Starlight callouts for important information:

````markdown
:::tip
Use this for helpful recommendations.
:::

:::note
Use this for neutral supporting context.
:::

:::caution
Use this for risks or things users commonly miss.
:::

:::danger
Use this for destructive, security-sensitive, or irreversible actions.
:::
````
