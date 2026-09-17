# Dibyendu Maity — Academic Portfolio

Personal academic portfolio site for Dibyendu Maity (computational biophysics: rare-event
sampling, transition pathways and kinetics, machine-learned molecular representations).
Built with [Astro](https://astro.build) + TypeScript and plain CSS, deployed to GitHub Pages.

## Content model

All research content lives in structured, typed data files under `src/data/`, separate
from the UI components. Update the site by editing these files — no component changes
needed for routine content updates:

- `src/data/profile.ts` — name, tagline, bio, links, availability
- `src/data/publications.ts` — full publication list (year, authors, venue, DOI, tags, code)
- `src/data/projects.ts` — featured research case studies
- `src/data/software.ts` — scientific software / GitHub repositories
- `src/data/education.ts` — education timeline (homepage-compact + full About record)
- `src/data/awards.ts` — awards and academic distinctions
- `src/data/talks.ts` — conference presentations and invited talks
- `src/data/expertise.ts` — technical expertise groups and research themes

The CV PDF is served from `public/cv.pdf`. Replace that file (keep the same name) to
update the downloadable CV without touching any code.

## Local development

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs static site to dist/
npm run preview   # serve the production build locally
```

Requires Node.js 18+.

## Deployment (GitHub Pages)

This repo is configured for a **user site** deployment at `https://dmighty007.github.io`
(root domain, no base path). The included workflow at
`.github/workflows/deploy.yml` builds the site with Astro and publishes `dist/` to
GitHub Pages automatically on every push to `main`, using the standard
`actions/upload-pages-artifact` + `actions/deploy-pages` flow.

To enable it:

1. Push this repository to `github.com/dmighty007/dmighty007.github.io`.
2. In the repo settings, go to **Settings → Pages** and set the source to
   **GitHub Actions**.
3. Push to `main` — the workflow builds and deploys automatically. The first run may
   take a minute to appear at the Pages URL.

If you instead deploy this as a **project site** (e.g.
`dmighty007.github.io/some-repo`), set `site` and add a `base` path in
`astro.config.mjs`, and update the `Sitemap:` line in `public/robots.txt` accordingly.

## Notes

- Fonts (Source Serif 4, Inter) are loaded from Google Fonts with `preconnect` and
  `display=swap` for fast text rendering.
- The hero and project visuals are hand-built inline SVG/CSS — no chart or animation
  library — kept subtle and respectful of `prefers-reduced-motion`.
- Publication filtering, search, and "Copy BibTeX" are implemented with a small
  vanilla-JS script (`src/components/PublicationsList.astro`); no client-side
  framework is used anywhere on the site.
- `og-image.svg` is an SVG Open Graph image; if a platform you care about doesn't
  render SVG previews, export it to PNG (1200×630) and update the reference in
  `src/layouts/BaseLayout.astro`.
- Google Scholar citation counts are intentionally not hardcoded (they go stale); the
  site links directly to the Scholar profile instead.

## Pre-deploy checklist

- [ ] `npm run build` completes without errors
- [ ] All DOI links open the correct paper
- [ ] All GitHub repository links resolve
- [ ] CV downloads correctly from `/cv.pdf`
- [ ] Publication filters, year select, and search all narrow the list correctly
- [ ] "Copy BibTeX" copies a well-formed entry
- [ ] Mobile nav opens/closes and all links work at 390px width
- [ ] Keyboard-only navigation reaches every interactive element with visible focus
- [ ] Site is readable and functional with `prefers-reduced-motion: reduce`
