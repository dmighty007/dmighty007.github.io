# Portfolio Improvement Plan — DONE

Reviewed & improved: index.html, styles.css (2167 lines), script.js (~1230 lines),
js/hero-scene.js (~860 lines), js/vendor/* (three.min.js, 3Dmol-min.js, 1ubq.pdb).

## Verified working (before)
- All assets serve 200 on local http.server.
- Both JS files pass `node --check`.
- SPA routing, publication search/filter/sort, keyboard tabs, focus trap, skip
  link, aria-live, prefers-reduced-motion all present.
- Three.js hero scene + 3Dmol protein viewer + 11s autocarousel functional.

## Changes applied

### Tier 1 — quick wins
1. [DONE] PathGennie "Play" button was dead (toggled `is-playing` with no CSS
   animation). Added `startPathMarkerAnimation()` in script.js that samples the
   SVG path via getPointAtLength + requestAnimationFrame; added CSS opacity
   rules for `#path-marker.is-playing`. Respects prefers-reduced-motion.
   Verified: Play -> marker animates with transform; Pause -> hides.
2. [DONE] About stats (6/4/3) were hardcoded. Added ids stat-publications /
   stat-peer-reviewed / stat-software and populate them from data in
   renderHome(). Verified rendered 6/4/3.
3. [DONE] Dead classes resolved: `.webgl-unavailable` now has a graceful CSS
   fallback (message + subtle gradient); `.brand-copy` styled. icon-* are inline
   SVG toggles (fine). `reduce-motion` toggle left (harmless, early-returns).

### Tier 2 — robustness
4. [DONE] 3Dmol `fetch('./js/vendor/1ubq.pdb')` failed on file:// (CORS). Added
   a protocol guard showing a clear "serve over http(s)" message.
5. [DONE] Removed dev cache-buster `?v=9999` from the two script tags.
6. [DONE] setSection now builds URL as pathname+search+hash (subpath-safe).
7. [DONE] Deleted unused js/vendor/three.module.js (~600KB bloat).

### Tier 3 — polish
8. [DONE] FES<->Protein tab switch now cross-fades with subtle scale (added
   transform to existing opacity transitions).
9. [DONE] Added scroll-progress bar (#scroll-progress) wired in bindEvents.
   Verified updates to non-zero width on scroll.
10. [DONE] Generated assets/portfolio-preview.png (1200x630) and pointed
    og:image at the local path (was a non-existent external URL).
11. [DONE] Added tools/validate.py: checks referenced local files exist and
    runs `node --check` on both JS files. Run: python3 tools/validate.py.

## Verification
- `node --check` passed for script.js and js/hero-scene.js.
- `python3 tools/validate.py` -> all 6 referenced local files exist, JS OK.
- Browser load: 0 console errors. Stats 6/4/3, scroll bar present, Play button
  animates marker, Pause hides it, og:image serves 200.
- Plan file: IMPROVEMENT_PLAN.md (this file).
