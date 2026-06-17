# AI Agent Skills & Guidelines: Documentation Boilerplate

This is the primary operating guide for AI agents and contributors working with projects based on this Astro Starlight Documentation Boilerplate.

The goal of this template is to help a team quickly launch polished, SEO-friendly, AI-discoverable documentation with consistent branding, clean navigation, and production-ready deployment.

For execution-level setup tracking, use `.agents/TASKS.md`. This `SKILLS.md` explains how to reason about the project, what to preserve, what to replace, and how to avoid template leftovers.

---

## 1. Project Mission & Definition of Done

When adapting this boilerplate for a new documentation project, the finished site must:

- Use the target project's real name, metadata, URLs, repository links, assets, and brand language.
- Remove all demo/example docs except `src/content/docs/others/ai-crawler.mdx`.
- Organize documentation into categories that match the actual product/project.
- Keep the homepage, sidebar, footer, 404 page, SEO metadata, social previews, sitemap, robots file, LLM feeds, and AI discovery files in sync.
- Avoid hardcoded placeholder strings, stale URLs, and broken internal links.
- Build successfully with `pnpm run build`.

Treat setup as incomplete until all public-facing references to the boilerplate project, `example.com`, and License Server placeholders are removed or intentionally retained. Because this boilerplate is for WPAnchorBay projects, WPAnchorBay source-brand references may remain where appropriate, especially the homepage footer and `WPANCHORBAY_URL`.

---

## 2. Core Architecture

This project is built on [Astro Starlight](https://starlight.astro.build/) and extends it with custom styling, component overrides, AI/LLM discovery endpoints, and GitHub Pages deployment.

### 2.1 Key Files & Directories

| Path | Purpose |
|---|---|
| `site-config.mjs` | Global deployment and branding constants: `SITE_ORIGIN`, `BASE_PATH`, `REPO_URL`, `LOGO_SVG_PATH`, `ICON_HREF`, `OG_IMAGE_HREF`. Start here for every new project. |
| `astro.config.mjs` | Astro + Starlight configuration: site title, description, sidebar, logo, social links, custom component overrides, custom CSS, and global `<head>` links including LLM-friendly alternates. |
| `package.json` | Project metadata, package scripts, Astro/Starlight dependencies, and the `mcp` / `mcp:http` scripts. Update `name` and `description`. |
| `src/lib/links.ts` | Centralized link registry: `EXTERNAL_LINKS`, `PAGE_LINKS`, `ASSET_LINKS`, `FEED_LINKS`. Components should use these constants instead of inline URLs. |
| `src/content/docs/` | Root directory for documentation content. Starlight loads `.md` and `.mdx` files from here. |
| `src/content/docs/index.mdx` | Homepage using a custom `template: splash` design. Contains hero content, four core-doc cards, OG/Twitter metadata, and footer import. Update it; do not remove it. |
| `src/content/docs/404.mdx` | Custom 404 page using a separate splash-style design. Contains hardcoded asset/page links in frontmatter and imports `PAGE_LINKS`. Update it; do not remove it. |
| `src/content/docs/others/ai-crawler.mdx` | Public page listing machine-readable discovery endpoints. Keep this page and update it when AI/agent files are added. |
| `src/content.config.ts` | Astro content collection setup using Starlight's `docsLoader()` and `docsSchema()`. Usually does not need changes. |
| `src/styles/home.css` | Core theme file for typography, layout polish, homepage styling, and light/dark mode overrides. Extend carefully; do not replace wholesale. |
| `src/components/` | Custom components and Starlight overrides such as `SiteTitle.astro`, `ThemeProvider.astro`, `ThemeSelect.astro`, `ThemeToggle.astro`, and the current footer component. |
| `src/components/starlight/` | Lower-level Starlight overrides, including `Head.astro`, `Card.astro`, `Icon.astro`, `SocialIcons.astro`, and `icon-map.ts`. |
| `src/components/starlight/icon-map.ts` | Local icon registry using Lucide-style SVG path data. Add new icons here when needed. |
| `src/assets/` | Source assets processed by Astro, including the homepage hero image and footer logo. |
| `public/assets/` | Static assets served as-is, including favicon and OpenGraph image. |
| `src/pages/robots.txt.ts` | Generates `robots.txt`. The boilerplate/demo blocks indexing with `Disallow: /`; real projects must update it to allow crawling and expose the sitemap. Uses `FEED_LINKS`. |
| `src/pages/llms.txt.ts` | Generates a compact LLM-readable documentation index. Uses `src/lib/llms.ts`. |
| `src/pages/llms-full.txt.ts` | Generates a fuller LLM-readable text export of the docs corpus. Uses `src/lib/llms.ts`. |
| `src/pages/markdown/[...slug].md.ts` | Generates per-page Markdown/MDX source exports such as `/markdown/index.md` and `/markdown/getting-started/installation.md`. |
| `src/lib/llms.ts` | Collects docs from the content collection and renders `llms.txt` / `llms-full.txt`. Contains project title text that must be updated. |
| `src/pages/.well-known/mcp.json.ts` | Public MCP discovery metadata. Contains project name/description and transport hints that must be updated. |
| `mcp/server.mjs` | Optional local MCP JSON-RPC server over stdio or HTTP. Currently contains License Server-specific names, tools, prompts, and URI scheme that must be replaced for new projects. |
| `.github/workflows/deploy.yml` | GitHub Pages deployment workflow using Node.js 24 and pnpm 10. Sets `SITE_ORIGIN` and `DOCS_REPO_URL` from GitHub context. |
| `.agents/TASKS.md` | Practical checklist for project setup and launch. Use it as the execution tracker. |
| `.agents/CONTENT_AUTHORING.md` | Detailed documentation writing rules for frontmatter, `.md` vs `.mdx`, Starlight components, tabs, code blocks, and callouts. |

---

## 3. New Project Initialization Workflow

When using this boilerplate for a new documentation site, follow this order.

### Step 1 — Replace Project Constants & Package Metadata

Update `site-config.mjs`:

- `SITE_ORIGIN`: canonical production origin, with no trailing slash.
- `BASE_PATH`: deployment base path. Use `"/repo-name"` for GitHub Pages project sites. Use `""` for root-domain deployments such as Vercel, Netlify, or a custom docs domain.
- `REPO_URL`: ask whether the project has a public GitHub repository. If yes, store the public repository URL here. If no, set this to an empty string (`""`) so the GitHub icon/link is hidden from the navbar.
- `LOGO_SVG_PATH`: source logo path used by Starlight.
- `ICON_HREF`: public favicon/logo URL, including `BASE_PATH`.
- `OG_IMAGE_HREF`: public social-preview image URL, including `BASE_PATH`.
- `WPANCHORBAY_URL`: keep this as `https://wpanchorbay.com`; it identifies the WPAnchorBay source brand.
- `WPANCHORBAY_PROJECT_LANDING_URL`: update this for each project. Use it for project/product landing-page CTAs.

After the user confirms the final `SITE_ORIGIN` and `BASE_PATH`, update every hardcoded absolute URL in frontmatter, metadata, docs content, and config comments so it matches the URL definitions from `site-config.mjs` / `src/lib/links.ts`. This is especially important for homepage canonical, OpenGraph, Twitter image, sitemap, and AI-discovery links.

Update `package.json`:

- Replace `name` with the new project slug.
- Replace `description` with the new project summary.
- Keep the existing scripts unless the project explicitly changes deployment or MCP behavior.

### Step 2 — Update Starlight Config

Update `astro.config.mjs`:

- Replace `title` and `description` with project-specific values.
- Update `logo.src` if the logo path changed.
- Update `social` links through `REPO_URL`. The navbar GitHub link comes from `site-config.mjs`; do not hardcode it in `astro.config.mjs`. If `REPO_URL` is empty, the GitHub link must stay hidden.
- Rebuild the `sidebar` to match the real documentation categories.
- Remove sidebar entries for deleted demo pages.
- Keep or update the global `rel="alternate"` LLM links in the `head` config so agents can discover `llms.txt` and `llms-full.txt` without scraping HTML.
- Keep the Starlight `Head` override wired to `src/components/starlight/Head.astro`; it adds page-specific Markdown alternate links for `/markdown/*.md` exports.

### Step 3 — Update the Centralized Link Registry

Update `src/lib/links.ts` before editing components and docs:

- Replace project-specific `EXTERNAL_LINKS` values. Keep `EXTERNAL_LINKS.wpAnchorBay` pointing to `WPANCHORBAY_URL`.
- Replace demo `PAGE_LINKS` values with the new docs structure.
- Update `ASSET_LINKS` if asset filenames change.
- Update `FEED_LINKS`, especially `canonical`, `ogImage`, `sitemap`, `llms`, `llmsFull`, and any MCP documentation link.

Important: MD/MDX frontmatter cannot use imported JavaScript constants. For YAML frontmatter values, hardcode the final URL and add a nearby comment naming the matching constant, such as `# FEED_LINKS.ogImage`.

### Step 4 — Replace All Branding Assets

Replace placeholder/demo assets with project-specific assets:

| Current File | Action |
|---|---|
| `src/assets/wpanchorbay-icon.svg` | Replace or rename to the new source logo icon. Update `LOGO_SVG_PATH`. |
| `src/assets/wpanchorbay-icon.png` | Replace or rename to the homepage hero image. Update `index.mdx` imports/frontmatter if renamed. |
| `src/assets/wpanchorbay-logo.svg` | Keep for the WPAnchorBay footer unless the user explicitly requests a different footer. |
| `public/assets/wpanchorbay-icon.svg` | Replace or rename to the public favicon/logo. Update `ICON_HREF`. |
| `public/assets/WPAnchorBay-Documentation-OG.png` | Replace or rename to the OpenGraph image. Update `OG_IMAGE_HREF`, `FEED_LINKS.ogImage`, and frontmatter metadata. |

Use 1200×630 px for OpenGraph images. Verify assets in light mode and dark mode.

### Step 5 — Rewrite Homepage Content

Update `src/content/docs/index.mdx` while preserving its homepage splash design unless the user explicitly requests a redesign:

- Do not delete `index.mdx`; it is the documentation homepage.
- Keep `template: splash` unless the user requests a different homepage format.
- Replace `title`, `description`, hero tagline, hero image alt text, and CTA labels.
- Replace all `og:*` and `twitter:*` metadata values.
- Replace hardcoded `example.com`, boilerplate, and repository URLs. Keep intentional WPAnchorBay footer/source-brand references.
- The homepage should show exactly four cards. These should link to the most important or core documentation pages for the project.
- Ask the user to choose or confirm the four homepage card links before finalizing them.
- Use the custom `Card.astro` `href` prop for clickable cards.
- Use Lucide-style icons already present in `src/components/starlight/icon-map.ts`; add missing Lucide path data there if needed and verify icons render without breaking the page.
- Keep `<WPAnchorBayFooter />` on the homepage unless the user explicitly asks to remove it.

### Step 6 — Update the 404 Page

Update `src/content/docs/404.mdx` while preserving its custom 404 splash design unless the user explicitly requests a redesign:

- Do not delete `404.mdx`; it is the site's custom not-found page.
- Keep the custom 404 layout and `template: splash` structure unless the user requests otherwise.
- Replace hardcoded image paths that include the old `BASE_PATH` and favicon filename.
- Replace action links and labels.
- Replace imported `PAGE_LINKS` references if demo pages were removed.
- Ensure the 404 page does not link to deleted demo docs.

### Step 7 — Remove Demo Content & Create Real Docs

Remove demo docs unless the project intentionally keeps them. Do not remove `src/content/docs/index.mdx`, `src/content/docs/404.mdx`, or `src/content/docs/others/ai-crawler.mdx`; update those special pages instead.

Remove:

- `src/content/docs/getting-started/installation.md`
- `src/content/docs/getting-started/configuration.md`
- `src/content/docs/guides/example.md`
- `src/content/docs/resources/official-docs.mdx`

Keep and update:

- `src/content/docs/others/ai-crawler.mdx`

Then create new docs organized by project-specific categories.

The recommended first section should be **Getting Started**, with pages in this order:

- Introduction
- Requirements
- Installation
- License Activation, if applicable
- Quick Start

After Getting Started, add other relevant sections such as:

- Concepts
- Configuration
- Guides
- API Reference
- Integrations
- Troubleshooting
- FAQ
- Changelog / Migration Notes

Only create categories that are relevant to the actual project.

### Step 8 — Update Footer & Brand Components

Keep `src/components/WPAnchorBayFooter.astro` and keep it rendered from `src/content/docs/index.mdx` unless the user explicitly asks to remove the WPAnchorBay footer.

Allowed footer changes:

- Update links through `EXTERNAL_LINKS` if needed.
- Keep WPAnchorBay source-brand copy and `WPANCHORBAY_URL` unless the user requests a different footer strategy.
- Do not rename, remove, or replace the footer during normal project setup.

If additional custom components include project-specific text or links, update those as needed.

### Step 9 — Update AI / Agent / Machine-Readable Discovery

This boilerplate is intentionally optimized for AI discovery. Keep that capability accurate.

Update these files:

| File | Required Action |
|---|---|
| `src/lib/llms.ts` | Replace the hardcoded `# License Server Documentation` heading with the new project documentation title. |
| `src/pages/llms.txt.ts` | Usually no structural change; confirm output after updating `src/lib/llms.ts`. |
| `src/pages/llms-full.txt.ts` | Usually no structural change; confirm output after updating `src/lib/llms.ts`. |
| `src/pages/markdown/[...slug].md.ts` | Generates static per-page Markdown/MDX source exports from docs content. Keep this route unless the project explicitly disables AI-friendly per-page source access. |
| `src/pages/robots.txt.ts` | Boilerplate/demo default is `Disallow: /` to prevent indexing. For an actual project, change it to allow crawling and expose `Sitemap: ${FEED_LINKS.sitemap}` plus relevant LLM discovery comments. |
| `src/pages/.well-known/mcp.json.ts` | Replace hardcoded `name`, `description`, docs links, and transport notes with project-specific values. |
| `mcp/server.mjs` | Replace License Server-specific URI scheme, server name, tool names, prompt names, descriptions, and console messages. |
| `src/content/docs/others/ai-crawler.mdx` | List every public discovery endpoint that should be discoverable by crawlers and AI agents. |

LLM-friendly alternate link convention:

- This boilerplate includes global `<link rel="alternate">` tags in `astro.config.mjs` for `llms.txt` and `llms-full.txt`, with `data-llm-hint` attributes to guide agents away from HTML scraping.
- This is similar in spirit to WordPress.org's `?output_format=md` Markdown alternate links, but static GitHub Pages deployments cannot dynamically render query-parameter variants.
- Prefer the global `llms.txt` / `llms-full.txt` links as the baseline for all projects.
- Per-page Markdown alternates are implemented by `src/pages/markdown/[...slug].md.ts` and advertised by `src/components/starlight/Head.astro` using `rel="alternate" type="text/markdown"`.
- The endpoint exposes the original Markdown/MDX source where available, so MDX pages may include imports or JSX components. This is intentional: it gives agents a page-specific source representation without scraping rendered HTML.
- Do not point a page-specific alternate link to unrelated aggregate content unless the title clearly says it is a site-wide docs index or full corpus export.

Recommended AI discovery additions when applicable:

- `.well-known/agent-skills/` for public agent-consumable skill definitions.
- A project-specific `SKILL.md` or similar agent instruction file.
- Optional public references to `.agents/SKILLS.md`, `.agents/TASKS.md`, and `.agents/CONTENT_AUTHORING.md` only when the project intentionally exposes repository/contributor guidance to AI agents.
- Sitemap-related AI discovery documentation when the project has multiple generated sitemap files.

If a `SKILL.md`, `.agents/SKILLS.md`, `.agents/TASKS.md`, or `.well-known/agent-skills/` file is added, also reference it from `src/content/docs/others/ai-crawler.mdx`.

Note: `.agents/` files are repository files, not automatically public website files. Do not expose them by default for every project. If a project intentionally needs public agent guidance, add explicit public routes or docs pages and reference them from `src/content/docs/others/ai-crawler.mdx`.

### Step 10 — Update Theme & Visual Identity

Optional but recommended:

- Tune accent colors, homepage gradients, and dark-mode values in `src/styles/home.css`.
- Use existing HSL custom properties where possible.
- Add new CSS at the end of the file or in a clearly labeled section.
- Verify contrast and readability in both light and dark modes.
- Do not introduce Tailwind CSS unless explicitly requested.

---

## 4. Content Authoring Rules

Detailed authoring guidance lives in `.agents/CONTENT_AUTHORING.md`.

Agents and contributors must read `.agents/CONTENT_AUTHORING.md` before creating or editing documentation pages. It covers:

- Official Astro/Starlight references.
- Required frontmatter.
- When to use `.md` vs `.mdx`.
- Starlight and custom components.
- Code blocks.
- Tabs.
- Callouts.
- Images (borders, lightbox).

---

## 5. Styling & UX Rules

- Preserve the template's premium, polished feel.
- Prefer short sections, scannable headings, tables, checklists, and callouts.
- Avoid large unbroken paragraphs.
- Verify dark mode whenever changing CSS, images, SVGs, or inline HTML.
- Extend `src/styles/home.css`; do not replace it wholesale.
- Use existing CSS custom properties before adding raw colors.
- Prefer Lucide Icons for visual consistency.
- Add missing icons to `src/components/starlight/icon-map.ts` using SVG path data.
- Do not add Tailwind CSS or utility-class styling unless explicitly requested.

### Images & Lightbox

All images inside `.sl-markdown-content` (i.e. rendered Markdown/MDX pages) automatically receive a rounded border via `src/styles/content-images.css`. The lightbox JS lives in `src/components/starlight/Head.astro` and is opt-in via `data-lightbox="true"`.

**Place screenshots in `public/assets/screenshots/`.** They are served at `{BASE_PATH}/assets/screenshots/your-image.png`.

| Syntax | Border + radius | Click opens lightbox |
|---|---|---|
| `![alt](src)` — standard Markdown | ✅ yes | ❌ no |
| `<img data-lightbox="true">` | ✅ yes | ✅ yes |
| `<img data-no-border>` | ❌ no | ❌ no |
| `<img data-lightbox="true" data-no-border>` | ❌ no | ✅ yes |

**Border + lightbox** — use raw HTML `<img>` with `data-lightbox="true"`:
```html
<img
  src="/{BASE_PATH}/assets/screenshots/your-image.png"
  alt="Description"
  data-lightbox="true"
/>
```

**Border only** — standard Markdown syntax (lightbox is opt-in only):
```markdown
![alt text](/{BASE_PATH}/assets/screenshots/your-image.png)
```

**No border, no lightbox** — use `data-no-border`:
```html
<img
  src="/{BASE_PATH}/assets/screenshots/your-image.png"
  alt="Description"
  data-no-border
/>
```

**Lightbox but no border** — combine both:
```html
<img
  src="/{BASE_PATH}/assets/screenshots/your-image.png"
  alt="Description"
  data-lightbox="true"
  data-no-border
/>
```

The lightbox closes on: clicking the dark backdrop, clicking the **x** button, or pressing **Escape**.

See `src/content/docs/guides/example.md` for live examples of all four variants.

---

## 6. Dependency, Build & Deployment Rules

- Use `pnpm` only. Do not use `npm` or `yarn`.
- If the user or environment does not have `pnpm`, ask them to install/enable `pnpm` before continuing. Do not switch package managers because the lockfile and GitHub workflow depend on `pnpm`.
- Respect `pnpm-lock.yaml`.
- Recommended commands:
  - `pnpm install`
  - `pnpm dev`
  - `pnpm run check`
  - `pnpm run build`
  - `pnpm run preview`
  - `pnpm run mcp`
  - `pnpm run mcp:http`
- GitHub Actions uses Node.js 24 and pnpm 10.
- The default workflow deploys to GitHub Pages and sets:
  - `SITE_ORIGIN` to `https://<owner>.github.io`
  - `DOCS_REPO_URL` to `https://github.com/<owner>/<repo>`
- For GitHub Pages project sites, keep `BASE_PATH` as `"/repo-name"`.
- For custom domains or root deployments, use `BASE_PATH = ""` and verify all frontmatter URLs manually.
- If deploying to Vercel, Netlify, Cloudflare Pages, or another host, review or replace `.github/workflows/deploy.yml`.

---

## 7. Placeholder & Hardcoded String Audit

Before launch, search for and replace these placeholders unless intentionally retained:

- `Documentation Boilerplate`
- `docs-boilerplate-starlight`
- accidental `WPAnchorBay` references outside the intended WPAnchorBay footer/source-brand context
- accidental `wpanchorbay` references outside intended asset names, footer/source-brand links, or WPAnchorBay-owned deployment defaults
- `example.com`
- `License Server`
- `license-server-for-woocommerce`
- `License Server for WooCommerce`
- `docs.wpanchorbay.com`
- `github.com/wpanchorbay`

Check especially:

- `site-config.mjs`
- `astro.config.mjs`
- `package.json`
- `src/lib/links.ts`
- `src/lib/llms.ts`
- `src/content/docs/index.mdx`
- `src/content/docs/404.mdx`
- `src/content/docs/others/ai-crawler.mdx`
- `src/components/WPAnchorBayFooter.astro`
- `src/pages/.well-known/mcp.json.ts`
- `mcp/server.mjs`
- `.github/workflows/deploy.yml`

---

## 8. Final Cleanup Checklist

Before publishing:

- [ ] `site-config.mjs` contains only project-specific values.
- [ ] `package.json` `name` and `description` are updated.
- [ ] `astro.config.mjs` title, description, social links, logo, and sidebar are updated.
- [ ] `src/lib/links.ts` reflects the final URL structure.
- [ ] After `SITE_ORIGIN` and `BASE_PATH` are confirmed, all hardcoded absolute links and metadata URLs have been updated to match the definitions from `site-config.mjs` / `src/lib/links.ts`.
- [ ] Homepage content and social metadata are updated while preserving the custom splash homepage design unless redesign was requested.
- [ ] 404 page links and asset paths are updated while preserving the custom 404 splash design unless redesign was requested.
- [ ] WPAnchorBay footer remains on the homepage unless the user explicitly requested removal.
- [ ] Project placeholder assets are replaced in `src/assets/` and `public/assets/`; WPAnchorBay footer assets are preserved unless removal/rebranding was explicitly requested.
- [ ] Demo docs are removed, except `src/content/docs/others/ai-crawler.mdx`.
- [ ] New project docs exist and are organized by meaningful categories.
- [ ] Sidebar entries match real pages.
- [ ] `src/lib/llms.ts` uses the new project title.
- [ ] MCP discovery and `mcp/server.mjs` are project-specific or removed if not needed.
- [ ] AI discovery page lists all public machine-readable resources.
- [ ] Global `rel="alternate"` links for `llms.txt` and `llms-full.txt` are present and point to the correct `BASE_PATH`.
- [ ] Page-specific `rel="alternate" type="text/markdown"` links are present and point to generated `/markdown/*.md` exports.
- [ ] If public agent-guide endpoints/pages were intentionally added, they expose only safe public guidance and are linked from `src/content/docs/others/ai-crawler.mdx`.
- [ ] `robots.txt` has been changed from the boilerplate/demo `Disallow: /` default to the intended production crawler policy.
- [ ] No stale hardcoded placeholder references remain; intentional WPAnchorBay source-brand references are preserved.
- [ ] `pnpm run check` passes.
- [ ] `pnpm run build` passes.

---

## 9. General Agent Instructions

- Read `.agents/TASKS.md` before performing a full project setup.
- Prefer editing existing files over creating parallel duplicate systems.
- When changing links, update `src/lib/links.ts` first, then update consumers.
- When changing frontmatter links, hardcode final URLs and add comments referencing the matching link constant.
- After the user confirms `SITE_ORIGIN`, update every hardcoded absolute URL to match the final `site-config.mjs` address and `BASE_PATH`; do not leave stale demo domains in metadata or docs.
- When deleting docs, update `astro.config.mjs`, `src/lib/links.ts`, `src/content/docs/404.mdx`, and any homepage CTAs that referenced them.
- When adding AI-agent files, make them discoverable from `src/content/docs/others/ai-crawler.mdx`.
- When unsure about visual direction, inspect `src/styles/home.css` and existing components before adding new patterns.
- For navbar GitHub links, ask whether the project has a public repository. If yes, set `REPO_URL`; if no, set `REPO_URL` to `""` and keep the navbar GitHub link hidden.
- For homepage cards, ask the user to choose or confirm the four core documentation links and verify each selected icon exists in `src/components/starlight/icon-map.ts`.
- Do not leave setup half-finished. A build that passes with stale branding is still incomplete.
