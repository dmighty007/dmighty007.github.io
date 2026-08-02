# Dibyendu Maity — Academic & Research Portfolio

This repository contains the academic and research portfolio website of **Dibyendu Maity**, a Computational Molecular Scientist specializing in machine learning methods for molecular states, rare events, structural phase identification, and molecular dynamics kinetics.

---

## 1. Project Architecture

The codebase uses standard HTML5, CSS component modules, and modern ES JavaScript modules without heavy framework dependencies.

```text
PortFolio/
├── index.html                  # Semantic pre-rendered markup with JSON-LD graphs & ARIA tabs
├── styles.css                  # Master CSS module importer (@import tokens, reset, etc.)
├── styles/                     # 13 Modular CSS Component Stylesheets
│   ├── tokens.css              # Design tokens (colors, typography, spacing, shadows)
│   ├── reset.css               # CSS reset rules
│   ├── typography.css          # Serif Playfair Display & sans-serif Inter typography
│   ├── layout.css              # Container grids & page sections
│   ├── navigation.css          # Brand mark, desktop navigation & mobile modal
│   ├── buttons.css             # Primary, secondary, pill & icon controls
│   ├── hero.css                # Hero layout & 3D visual container
│   ├── publications.css        # Search bar, filter pills, paper cards & abstract drawers
│   ├── research.css            # Case studies & Postdoctoral Research Fit grid
│   ├── software.css            # Software project tabs, code blocks & copy buttons
│   ├── cv.css                  # Academic CV layout & timeline cards
│   ├── responsive.css          # Mobile/tablet breakpoints
│   └── print.css               # Print-specific CV styling (@media print)
├── js/
│   ├── hero-scene.js           # Three.js 3D Free-Energy Surface & Langevin simulation
│   └── vendor/                 # Localized vendor libraries (three.min.js, 3Dmol-min.js, 1ubq.pdb)
├── src/                        # 21 ES JavaScript Modules
│   ├── main.js                 # Application bootstrap & lifecycle orchestrator
│   ├── navigation.js           # Subroute router (#research/pathgennie, #publications, etc.)
│   ├── accessibility.js        # Focus trap, background inert lock, ARIA live announcements
│   ├── data/                   # Data schemas (publications.js, software.js, research.js, etc.)
│   ├── components/             # Renderers (hero-controller.js, publications-view.js, etc.)
│   └── utils/                  # Core utilities (bibliography.js, clipboard.js, escape-html.js)
├── tests/
│   └── portfolio.spec.js       # Playwright E2E browser test suite
├── tools/
│   └── validate.py             # Python static, HTML, ARIA & schema validator
├── .github/workflows/
│   └── ci.yml                  # GitHub Actions CI workflow
├── _headers                    # Production deployment security & caching headers
├── package.json                # Project dependencies & npm scripts
├── robots.txt                  # Search engine crawler instructions
└── sitemap.xml                 # XML sitemap configuration
```

---

## 2. Local Development & Testing Commands

### Local Development Server
Serve the portfolio over local HTTP to support WebGL asset fetching (`1ubq.pdb`):
```bash
python3 -m http.server 8899
```
Then navigate to `http://localhost:8899/` in your browser.

### Static & Schema Validation
Execute the static validation suite to check local asset links, HTML DOM uniqueness, ARIA target existence, publication/software schema contracts, and Node.js ES module syntax:
```bash
python3 tools/validate.py
```

### ES Module Syntax Check
Check JavaScript syntax across all modules:
```bash
node --check src/main.js
```

### Playwright End-to-End Browser Tests
Run the Playwright E2E browser test suite:
```bash
npx playwright test
```

---

## 3. Data Schema & Content Maintenance Workflow

### Updating Publications (`src/data/publications.js`)
Every publication entry must conform to the following schema contract:
```javascript
{
  id: "unique-paper-id",
  title: "Full Paper Title",
  authors: ["Author One", "Dibyendu Maity", "Author Three"],
  year: 2026,
  journal: "Journal Name",
  volume: "21",          // string or null if unassigned
  issue: "4",            // string or null if unassigned
  pages: "100-110",      // string or null if unassigned
  doi: "10.1021/...",    // DOI string or null
  url: "https://doi.org/...",
  status: "peer-reviewed", // "peer-reviewed" | "preprint" | "submitted"
  thesisChapter: "Chapter 1", // string or null
  selected: true,        // boolean
  verifiedAt: "2026-07-26",
  evidenceUrl: "https://doi.org/...",
  metrics: {
    citationCount: 5,
    retrievedAt: "2026-07-26",
    source: "Google Scholar"
  },
  abstract: "Objective, evidence-based abstract...",
  contribution: "Author's specific technical contribution...",
  tags: ["Keyword 1", "Keyword 2"]
}
```

### Updating Software Projects (`src/data/software.js`)
Software entries require an explicit `verificationStatus` tag (*Executed successfully*, *Syntax validated*, *Repository verified*):
```javascript
{
  id: "software-id",
  name: "ToolName",
  tagline: "Short 1-sentence summary",
  purpose: "Expanded explanation",
  capabilities: ["Feature 1", "Feature 2"],
  supportedSystems: ["Linux", "macOS"],
  language: "Python / PyTorch",
  dependencies: ["torch", "numpy"],
  installCommand: "pip install git+https://github.com/...",
  minimalUsage: `import tool...`,
  testStatus: "Open-source research software",
  verificationStatus: "Syntax validated",
  license: "MIT",
  repository: "https://github.com/..."
}
```

---

## 4. Production Deployment Checklist & Security Headers

When deploying to hosting platforms (e.g. Netlify, Cloudflare Pages, GitHub Pages), verify:
1. **HTTPS Enforcement**: Ensure HTTP-to-HTTPS redirection is enabled.
2. **Security Headers**: Verify headers defined in `_headers`:
   - `X-Frame-Options: DENY`
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
3. **Asset Caching**: Static assets under `/assets/` and `/js/vendor/` should be cached with `Cache-Control: public, max-age=31536000, immutable`.
4. **Canonical Production Domain**: Metadata canonical tags use `https://dibyendumaity.dev/`.

---

## 5. Verification Matrix & Status Summary

| Area | Status | Verification Method |
|---|---|---|
| **Static Asset Integrity** | **PASS** | `python3 tools/validate.py` (Local files exist) |
| **HTML DOM & ARIA** | **PASS** | Unique IDs, resolving ARIA controls, complete alt tags |
| **Publication Schemas** | **PASS** | 10 publications verified against Google Scholar & Thesis |
| **Software Schemas** | **PASS** | 5 tools verified with execution status labels |
| **ES Module Syntax** | **PASS** | 21 modules verified via `node --check` |
| **E2E Browser Navigation** | **PASS** | Playwright test suite (`tests/portfolio.spec.js`) |
| **Accessibility Target** | **PASS** | WCAG 2.1 AA implementation verified |
| **SEO & Sitemap** | **PASS** | `robots.txt` & `sitemap.xml` validated |
