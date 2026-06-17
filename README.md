# Documentation Boilerplate

A reusable, production-ready documentation template built on [Astro Starlight](https://starlight.astro.build/). 
This boilerplate is pre-configured with custom dark-mode aesthetics, custom components, optimized workflows, and GitHub Pages deployment.

## Features

- **Pre-configured Starlight:** Customized components, typography, and specific visual tweaks tailored for high-quality technical docs.
- **GitHub Pages Ready:** Includes a working `.github/workflows/deploy.yml` that uses `pnpm` to build and deploy straight to GitHub Pages.
- **Theme-Aware:** Optimized CSS overrides for both Light and Dark modes.
- **SEO Optimized:** Sitemap, robots.txt, and metadata configured.

## Quick Start

1. Copy this boilerplate into your new project directory.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Update `site-config.mjs` with your repository and domain details.
4. Update `astro.config.mjs` with your project's `title`, `description`, and `sidebar` structure.
5. Update `package.json` with your project's name.
6. Run the local dev server:
   ```bash
   pnpm dev
   ```

## Customizing the Look

To change logos, update the SVG and PNG files inside `src/assets/` and `public/assets/`. You can edit the hero image directly in `src/content/docs/index.mdx`.

## Troubleshooting

### Linux: File Watcher Limit (`ENOSPC`)

If you encounter an `ENOSPC` error when running `pnpm dev` or `pnpm start` on Linux, it means you've reached the system limit for file watchers. You can increase this limit by running:

```bash
sudo sysctl fs.inotify.max_user_watches=524288 && echo "fs.inotify.max_user_watches=524288" | sudo tee -a /etc/sysctl.conf
```

## AI Agent Integration

This project includes an [AI Agent Skills & Guidelines](.agents/SKILLS.md) file to assist AI coding agents in maintaining project standards, consistent styling, and correct deployment procedures when working on this documentation suite.
