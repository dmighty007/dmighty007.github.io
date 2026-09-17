Build a complete, production-quality personal academic portfolio website for **Dibyendu Maity**, a computational biophysics researcher working at the intersection of molecular simulation, statistical mechanics, rare-event sampling, and machine learning.

The website should be based primarily on the **attached CV**, supplemented by these authoritative profiles:

* Google Scholar: https://scholar.google.com/citations?user=FkqKBRkAAAAJ&hl=en
* GitHub: https://github.com/dmighty007

Treat the CV as the authoritative source for biographical information, education, research description, publications, talks, awards, technical expertise, and software. Use Google Scholar to supplement publication links/metadata where appropriate and GitHub to link the actual software repositories. Do not invent publications, citation counts, affiliations, awards, positions, dates, or project descriptions.

# Primary objective

Create an academic portfolio suitable for:

* postdoctoral applications
* research collaborations
* conference networking
* potential supervisors and PIs
* computational molecular science researchers
* visitors arriving through Google Scholar, GitHub, papers, or conference materials

The site should make the research identity clear within 5–10 seconds.

It must feel like the personal website of a serious computational scientist — **simple, elegant, restrained, technically sophisticated, and professional**.

Avoid anything that looks like:

* a generic developer portfolio
* a SaaS landing page
* a flashy startup site
* a gaming interface
* an AI-generated template
* excessive glassmorphism
* excessive gradients
* neon colors
* giant animated text
* skill percentage bars
* decorative blobs
* unnecessary badges
* overuse of cards
* excessive icons
* gimmicky scrolling effects

---

# Design direction

Use a refined academic/editorial visual style.

## Visual language

Base palette:

* warm white / very pale gray background
* deep navy or charcoal typography
* restrained teal or blue-green accent
* subtle cool-gray borders
* occasional muted scientific colors for diagrams only

Typography:

* elegant serif or high-quality display typeface for major headings
* clean sans-serif for body text, metadata, navigation, and UI
* excellent typographic hierarchy
* generous whitespace
* comfortable line length
* strong readability

The overall feeling should be:

**Nature / JCTC / scientific editorial design + modern research laboratory website + understated personal identity.**

Do not imitate any publication directly.

---

# Animation philosophy

The website should be animated, but animation must remain subtle and functional.

Use:

* gentle fade/translate entrance animations
* staggered reveals
* restrained text transitions
* subtle hover movement
* publication row interactions
* smooth section transitions
* understated animated scientific background in the hero
* microinteractions on buttons and navigation
* animated filtering/search transitions
* smooth scrolling where appropriate

Do NOT use:

* aggressive parallax
* particles flying everywhere
* cursor-following effects
* excessive spring animations
* spinning objects
* 3D card tilting
* animation that competes with the research content

Respect `prefers-reduced-motion`.

Animations should normally last around 200–600 ms and use natural easing.

---

# Site architecture

Use a clean sticky navigation:

Dibyendu Maity / Research / Publications / Software / About / CV / Contact

On mobile, convert this into a refined compact menu.

Recommended main routes:

/
/research
/publications
/software
/about

A single-page architecture is also acceptable if the resulting navigation and information hierarchy remain excellent.

---

# 1. Homepage hero

The hero should immediately establish identity and research direction.

Use:

**Dibyendu Maity**

**Computational Biophysics · Molecular Simulation · Machine Learning**

Develop a concise research statement based on the CV along the lines of:

“I develop machine-learning-guided methods for discovering rare molecular events, reconstructing transition pathways, and extracting kinetics from molecular simulations.”

Do not use generic language such as:
“Passionate researcher pushing the boundaries of science.”

Mention:

* Ph.D. in Physics (Theoretical)
* University of Calcutta / S. N. Bose National Centre for Basic Sciences
* Ph.D. thesis submitted
* availability for postdoctoral research positions from late 2026

Primary actions:

* Explore Research
* View Publications

Secondary actions:

* Download CV
* Google Scholar
* GitHub
* Email

Include only useful actions. Do not overload the hero.

---

# Hero scientific visual

Create an elegant custom scientific visual instead of using stock imagery.

Possible concept:

A minimalist free-energy landscape with several molecular transition pathways running between metastable basins.

Some trajectories should be faint.
A few meaningful transition pathways should emerge clearly.
Small nodes or walkers may suggest adaptive or weighted-ensemble sampling.
A subtle latent-space / representation-learning motif can appear in the background.

The visualization should reference the research themes:

* rare events
* transition pathways
* adaptive sampling
* weighted ensemble
* machine-learned collective variables
* free-energy landscapes

It should be scientifically plausible but primarily decorative.

Implement it with lightweight SVG, Canvas, CSS, or similar technology.

Do not use random molecular stock images.

Animation should be very slow and subtle, e.g.:

* path drawing
* walker motion
* contour breathing
* node transitions
* gradual trajectory appearance

The visualization must remain subordinate to the text.

---

# 2. Research overview

Create a concise section titled:

**Research**

Start with a short paragraph synthesizing the research profile from the CV.

Then organize the work around approximately four scientific themes.

Suggested themes:

### Rare-event sampling

Adaptive simulation strategies for efficiently discovering infrequent molecular transitions.

### Transition pathways & kinetics

Pathway discovery, pathway-resolved analysis, weighted-ensemble simulations, fluxes, MFPTs, and kinetic observables.

### Machine-learned molecular representations

Autoencoders, variational autoencoders, learned collective variables, dimensionality reduction, and data-driven descriptors.

### Molecular & materials simulation

Applications spanning proteins, molecular recognition, phase transitions, molecular materials, solvation, and related problems.

Do not artificially force every publication into one category.

---

# 3. Featured research

This should be one of the strongest sections of the site.

Create 3–4 substantial featured research case studies rather than many tiny cards.

Prioritize work in which Dibyendu Maity has a major methodological role.

Candidates include:

## PathGennie

Direction-guided adaptive sampling for rapid generation of rare-event transition pathways using ultrashort monitored trajectories.

Show:

* scientific problem
* methodological idea
* why it matters
* publication
* code repository
* DOI
* minimal scientific visualization

## IceCoder

Variational-autoencoder-based representation learning for identifying ice phases in molecular simulations.

Show:

* local molecular environments
* learned latent representation
* unsupervised phase discrimination
* publication
* repository
* DOI

## Pathway-resolved kinetics

Neural-network-guided weighted-ensemble simulations for separating pathways and estimating channel-specific kinetics.

Show:

* multiple pathway families
* neural-network/path-coordinate refinement
* independent weighted-ensemble channels
* rate / flux / MFPT concepts

## TRAILS-MD

Lineage-aware adaptive molecular-dynamics framework.

Describe it as a software/research framework only to the extent supported by the CV and associated repository/documentation.

Each case study should follow approximately:

Problem → Approach → Scientific contribution → Related publication/software

Avoid marketing language.

---

# 4. Selected research evidence

Create a compact evidence strip or snapshot rather than vanity metrics.

Possible items:

* peer-reviewed publications
* scientific software projects
* poster / invited presentations
* poster awards
* research areas

Do not hardcode Google Scholar citation counts unless retrieved reliably.

If live Scholar metrics cannot be obtained reliably, simply provide a prominent Google Scholar link.

Accuracy is more important than displaying metrics.

---

# 5. Publications

Create a dedicated publication section with polished filtering and search.

Use all publications listed in the CV.

Each publication entry should include where available:

* year
* full title
* authors
* venue
* volume/pages/article number
* DOI
* publication status
* code/software link if appropriate
* preprint link if applicable

Highlight **Dibyendu Maity** in the author list.

Recommended controls:

* All
* First-author / major-author work
* Methods
* Applications
* Year
* Search

Only add a category if it is defensible from the publication itself.

Do not invent labels.

Use a compact scholarly bibliography layout rather than large cards for every publication.

Include DOI buttons with restrained styling.

If BibTeX can be reliably generated from DOI metadata, optionally provide:
“Copy BibTeX”

Use graceful animations when filtering.

---

# 6. Scientific software

Create a dedicated software section.

Include:

### TRAILS-MD

Python
Lightweight, engine-agnostic framework for lineage-aware adaptive molecular-dynamics sampling.

### PathGennie

Python
Direction-guided adaptive-sampling framework for rapidly generating rare-event transition pathways.

Repository:
https://github.com/dmighty007/PathGennie

### IceCoder

Python / PyTorch
Unsupervised representation-learning framework for classification/identification of ice polymorphs and liquid environments.

Repository:
https://github.com/dmighty007/IceCoder

### SolOrder

Python / C++
Local solvation and structural-order-parameter analysis utilities for molecular simulations.

Repository:
https://github.com/dmighty007/SolOrder

Use the actual GitHub repositories to supplement:

* repository link
* description
* language
* documentation/demo links where available

Do not turn this section into a GitHub-statistics dashboard.

Stars and forks are optional and should only appear if fetched dynamically and unobtrusively.

Focus on scientific purpose rather than software popularity.

---

# 7. Research timeline / experience

Create a restrained vertical timeline covering the main academic progression:

* B.Sc. Physics (Honours)
* M.Sc. Physical Sciences
* Ph.D. Physics (Theoretical)
* current research stage / thesis submission

Do not reproduce secondary-school education prominently on the homepage.

Full education details can remain on the About page or CV.

---

# 8. Talks and conferences

Create a compact section for selected scientific presentations.

Prioritize significant/recent events and recognitions, including:

* CDAM 2026
* ML / enhanced-sampling workshop
* RARE 2025
* MD@60
* ML4MS
* TCS
* SoPhyC
* RAC-TCA
* invited lecture where applicable

Clearly distinguish:

* invited talks
* lightning talks
* posters
* awards

Do not render this as dozens of visually heavy cards.

A timeline or structured list is preferable.

---

# 9. Awards & recognition

Include the awards and academic distinctions from the CV, such as:

* INSPIRE Scholarship
* GATE Physics
* NGPE recognition
* JEST
* IIT JAM
* poster awards

Poster awards associated with conferences may be surfaced more prominently than entrance-examination ranks if space is constrained.

Keep presentation factual.

---

# 10. Technical expertise

Avoid progress bars or arbitrary percentages.

Organize expertise semantically.

For example:

### Molecular simulation

Molecular Dynamics
Enhanced Sampling
Metadynamics
Umbrella Sampling
Adaptive Sampling
Rare-Event Sampling
Langevin Dynamics
Weighted Ensemble

### Machine learning

Representation Learning
Autoencoders
Variational Autoencoders
Deep Learning
Data-driven collective variables
Pathway analysis

### Programming

Python
NumPy
SciPy
PyTorch
MDAnalysis
MDTraj
C++
Bash

### Simulation / scientific computing

GROMACS
OpenMM
PLUMED
Git
Linux
HPC environments

Use compact typographic groups rather than hundreds of pills.

---

# 11. About

Create a concise professional biography.

The copy should communicate that Dibyendu Maity is a computational researcher whose work combines:

* theoretical/computational physics
* statistical mechanics
* molecular dynamics
* machine learning
* enhanced sampling
* scientific software development

Keep it factual and restrained.

Include a professional portrait only if a real supplied photograph is available.

Never create a synthetic portrait or generic researcher image.

---

# 12. Contact

Create a minimal final contact section.

Possible heading:

**Research, collaboration, and postdoctoral opportunities**

Include:

* professional email
* Google Scholar
* GitHub
* downloadable CV

Avoid a large generic contact form unless there is a clear reason to include one.

---

# Interaction design

Desktop navigation:

* sticky
* semi-opaque/solid background after scrolling
* current-section indicator
* subtle underline animation

Publication entries:

* title emphasized
* metadata secondary
* DOI/code actions revealed cleanly
* no excessive shadows

Research projects:

* scientific figure or custom diagram on one side
* explanation on the other
* alternate visual orientation between sections if useful

Buttons:

* minimal
* subtle rounded corners
* no pill-shaped button everywhere
* strong focus state

Links:

* clearly identifiable
* accessible keyboard focus

---

# Responsive behavior

The website must be excellent at:

* 1440px desktop
* typical laptop resolutions
* tablets
* 390–430px mobile

Do not simply stack desktop cards vertically.

Specifically redesign:

* hero visualization
* navigation
* publication controls
* research case studies
* timelines
  for mobile.

Typography should use responsive `clamp()` values.

Avoid oversized hero headings on mobile.

---

# Accessibility

Meet WCAG AA where practical.

Implement:

* semantic HTML
* keyboard-accessible navigation
* visible focus states
* alt text
* sufficient contrast
* reduced-motion mode
* ARIA only where semantically necessary
* skip-to-content link

All interactive controls should work without a mouse.

---

# Performance

Target:

* Lighthouse performance > 90
* minimal JavaScript
* optimized images
* lazy-load below-the-fold media
* avoid huge animation libraries unless necessary
* prevent layout shift
* use responsive images
* load fonts efficiently

Avoid unnecessary dependencies.

---

# SEO and academic discoverability

Implement:

* descriptive `<title>`
* strong meta description
* canonical URL
* OpenGraph metadata
* Twitter/X card metadata if useful
* favicon
* sitemap.xml
* robots.txt
* structured data using Schema.org Person / ScholarlyArticle where appropriate

Use metadata that clearly identifies:
**Dibyendu Maity — Computational Biophysics Researcher**

Include research keywords naturally rather than keyword stuffing.

---

# Technology

Choose a modern, maintainable stack.

Preferred options:

**Astro + TypeScript + CSS/SCSS**

or

**Next.js + TypeScript**

Prefer Astro if the site is predominantly static.

For animation, prefer:

* CSS
* IntersectionObserver
* lightweight SVG animation
* Motion/Framer Motion only where it materially improves the interface

Keep publication/project data separate from UI components, e.g.:

`src/data/publications.ts`
`src/data/projects.ts`
`src/data/talks.ts`

This will make future updates simple.

---

# Content management

Do not scatter research content across component files.

Create structured data files for:

* publications
* software
* research projects
* education
* awards
* presentations

Each entry should support optional:

* DOI
* URL
* GitHub
* abstract
* image
* year
* tags
* featured status

---

# Scientific graphics

Where graphical assets are needed, create original minimal vector diagrams based on the scientific concepts.

Examples:

* free-energy landscape
* molecular transition network
* latent-space representation
* adaptive trajectory tree
* weighted-ensemble walkers
* pathway families

These should be abstract and polished rather than pretending to be actual simulation data.

Never fabricate numerical results in decorative charts.

---

# Important content principle

Do not merely convert the CV into a website.

Instead create three layers:

### Layer 1 — 10-second overview

Who is Dibyendu Maity?
What does he research?
What are his strongest contributions?
Is he available for postdoctoral work?

### Layer 2 — 1-minute research overview

Research themes
Featured projects
Selected publications
Software

### Layer 3 — detailed academic record

Complete publications
Talks
Awards
Education
Technical expertise
CV

The homepage should primarily serve Layers 1 and 2.

---

# Tone

Use academic, precise, understated copy.

Prefer:

“Developing machine-learning-guided methods for sampling rare molecular transitions.”

over:

“Revolutionizing molecular science with cutting-edge AI.”

Never use inflated phrases such as:

* visionary
* groundbreaking researcher
* passionate innovator
* revolutionary
* world-class
* transformative genius

Let the scientific work establish credibility.

---

# Optional distinctive element

Introduce one subtle recurring visual motif representing **pathways through complex landscapes**.

For example:

* a thin trajectory line begins in the hero
* similar geometry appears in research-section dividers
* pathway curves subtly reappear in project graphics
* the footer resolves the trajectory into a target state

Keep this restrained enough that most visitors perceive coherence rather than a visual gimmick.

---

# Footer

Minimal footer containing:

Dibyendu Maity
Computational Biophysics / Molecular Simulation / Machine Learning

Google Scholar · GitHub · Email · CV

Copyright year dynamically generated.

No oversized footer.

---

# Deliverables

Produce a complete working website, not a mockup.

Include:

1. production-ready source code
2. responsive layouts
3. animations
4. all content extracted from the supplied CV
5. publication database
6. software/project database
7. CV download
8. Google Scholar integration/link
9. GitHub integration/link
10. SEO metadata
11. structured data
12. accessibility support
13. responsive scientific visualizations
14. favicon / simple monogram identity if appropriate
15. README with local-development and deployment instructions

Before considering the site finished, test:

* all navigation links
* DOI links
* GitHub links
* Scholar link
* CV download
* mobile navigation
* publication filtering
* keyboard navigation
* reduced-motion behavior
* dark text contrast
* overflow at 390px
* JavaScript-disabled readability where practical
* 404 behavior
* metadata
* build process

The final result should feel polished enough to send directly to a prospective postdoctoral supervisor or collaborator.

