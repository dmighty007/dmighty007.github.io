/**
 * Figures view component: renders interactive scientific SVG diagrams
 * with proper WAI-ARIA labels, <title>, and detailed <desc> tags.
 */
import { escapeHTML } from "../utils/escape-html.js";

export function renderPathGennieSVG() {
  return `
    <figure class="svg-figure-container">
      <svg
        viewBox="0 0 800 400"
        role="img"
        aria-labelledby="pathgennie-svg-title pathgennie-svg-desc"
        class="scientific-svg"
      >
        <title id="pathgennie-svg-title">PathGennie Direction-Guided Adaptive Sampling Diagram</title>
        <desc id="pathgennie-svg-desc">
          Parallel short trajectories branch from the initial basin A. Monitored MD segments evaluate progress coordinates in real time.
          Productive branches advancing toward target basin B are selected and spawned, while un-productive trajectories in energy wells are pruned.
        </desc>
        
        <!-- Background Energy Landscape Grid -->
        <path d="M 50 350 Q 200 100 400 250 T 750 80" fill="none" stroke="var(--border-strong)" stroke-width="2" stroke-dasharray="4 4" />
        
        <!-- Basin A -->
        <circle cx="100" cy="310" r="30" fill="var(--surface-muted)" stroke="var(--navy)" stroke-width="2" />
        <text x="100" y="315" text-anchor="middle" font-size="14" font-weight="bold" fill="var(--navy)">Basin A</text>

        <!-- Basin B -->
        <circle cx="700" cy="90" r="30" fill="var(--surface-muted)" stroke="var(--teal)" stroke-width="2" />
        <text x="700" y="95" text-anchor="middle" font-size="14" font-weight="bold" fill="var(--teal)">Basin B</text>

        <!-- Trajectory Spawning Branches -->
        <path id="path-marker-trail" d="M 100 310 Q 250 200 400 260 T 700 90" fill="none" stroke="var(--rust)" stroke-width="3.5" />

        <circle id="path-marker" cx="100" cy="310" r="8" fill="var(--rust)" />

        <g transform="translate(400, 260)">
          <circle cx="0" cy="0" r="6" fill="var(--teal)" />
          <text x="12" y="4" font-size="12" fill="var(--text-secondary)">Ultrashort Monitored Segment</text>
        </g>
      </svg>
      <figcaption><strong>Figure 1:</strong> Direction-guided adaptive sampling workflow. Short trajectories are spawned in parallel, evaluated against progress coordinates, and selected for barrier crossing.</figcaption>
    </figure>
  `;
}
