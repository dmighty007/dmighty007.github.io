/**
 * Publications view component: handles rendering, filtering by status,
 * searching, sorting, and BibTeX copy modals.
 */
import { publications } from "../data/publications.js";
import { escapeHTML } from "../utils/escape-html.js";
import { generateBibTeX } from "../utils/bibliography.js";
import { copyText } from "../utils/clipboard.js";
import { setLiveStatus } from "../accessibility.js";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

let activeFilter = "all";
let activeSort = "newest";
let searchQuery = "";

export function initPublicationsView() {
  bindPublicationEvents();
  renderPublications();
}

function bindPublicationEvents() {
  const searchInput = $("#publication-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderPublications();
    });
  }

  const filterGroup = $(".publication-filters");
  if (filterGroup) {
    filterGroup.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-filter]");
      if (!btn) return;

      $$("[data-filter]", filterGroup).forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-pressed", "false");
      });

      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");

      activeFilter = btn.getAttribute("data-filter");
      renderPublications();
    });
  }

  const sortSelect = $("#publication-sort");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      activeSort = e.target.value;
      renderPublications();
    });
  }
}

export function renderPublications() {
  const container = $("#publications-list");
  if (!container) return;

  let list = publications.filter((pub) => {
    if (activeFilter === "peer-reviewed" && pub.status !== "peer-reviewed") return false;
    if (activeFilter === "preprint" && pub.status !== "preprint") return false;
    if (activeFilter === "submitted" && pub.status !== "submitted") return false;

    if (searchQuery) {
      const haystack = [
        pub.title,
        ...(pub.authors || []),
        pub.journal,
        pub.abstract,
        ...(pub.tags || [])
      ].join(" ").toLowerCase();
      if (!haystack.includes(searchQuery)) return false;
    }

    return true;
  });

  list.sort((a, b) => {
    if (activeSort === "newest") return b.year - a.year;
    if (activeSort === "oldest") return a.year - b.year;
    if (activeSort === "citations") return (b.metrics?.citationCount || 0) - (a.metrics?.citationCount || 0);
    return 0;
  });

  if (list.length === 0) {
    container.innerHTML = `
      <div class="no-results-card">
        <p>No publications match your criteria.</p>
      </div>
    `;
    setLiveStatus("No publications found for search filter.");
    return;
  }

  container.innerHTML = list.map((pub) => renderPublicationCard(pub)).join("");
  bindCardButtons(container);

  setLiveStatus(`Showing ${list.length} publication${list.length === 1 ? "" : "s"}.`);
}

export function renderSelectedPublicationsHome() {
  const container = $("#selected-publications");
  if (!container) return;

  const selected = publications.filter((p) => p.selected || p.status === "peer-reviewed").slice(0, 3);
  container.innerHTML = selected.map((pub) => renderCompactPublicationCard(pub)).join("");
  bindCardButtons(container);
}

function renderPublicationCard(pub) {
  const authorsText = pub.authors
    .map((a) => (a.includes("Maity") ? `<strong>${escapeHTML(a)}</strong>` : escapeHTML(a)))
    .join(", ");

  const statusBadge =
    pub.status === "peer-reviewed"
      ? `<span class="badge badge-success">Peer-reviewed</span>`
      : pub.status === "preprint"
      ? `<span class="badge badge-warning">Preprint</span>`
      : `<span class="badge badge-info">Submitted manuscript</span>`;

  const citationText = pub.metrics && pub.metrics.citationCount > 0
    ? `<span class="pub-citation-count" title="Retrieved ${pub.metrics.retrievedAt} from ${pub.metrics.source}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        ${pub.metrics.citationCount} citation${pub.metrics.citationCount === 1 ? "" : "s"}
      </span>`
    : "";

  const thesisText = pub.thesisChapter
    ? `<span class="badge badge-subtle" title="Ph.D. Thesis Chapter">${pub.thesisChapter}</span>`
    : "";

  return `
    <article class="publication-card" id="${escapeHTML(pub.id)}">
      <div class="pub-header">
        <div class="pub-meta-top">
          <span class="pub-year">${pub.year}</span>
          ${statusBadge}
          ${thesisText}
          ${citationText}
        </div>
        <h3 class="pub-title">
          <a href="${escapeHTML(pub.url || (pub.doi ? `https://doi.org/${pub.doi}` : '#'))}" target="_blank" rel="noopener noreferrer">
            ${escapeHTML(pub.title)}
          </a>
        </h3>
        <p class="pub-authors">${authorsText}</p>
        <p class="pub-venue">
          <em>${escapeHTML(pub.journal)}</em>${pub.volume ? `, <strong>${escapeHTML(pub.volume)}</strong>` : ""}${pub.pages ? `, ${escapeHTML(pub.pages)}` : ""}
          ${pub.doi ? ` · <span class="pub-doi">DOI: ${escapeHTML(pub.doi)}</span>` : ""}
        </p>
      </div>

      ${pub.abstract ? `
        <details class="pub-abstract-details">
          <summary class="pub-abstract-summary">Abstract & Contribution</summary>
          <div class="pub-abstract-body">
            <p><strong>Abstract:</strong> ${escapeHTML(pub.abstract)}</p>
            ${pub.contribution ? `<p><strong>My Role:</strong> ${escapeHTML(pub.contribution)}</p>` : ""}
          </div>
        </details>
      ` : ""}

      <div class="pub-actions">
        ${pub.doi ? `<a href="https://doi.org/${escapeHTML(pub.doi)}" target="_blank" rel="noopener noreferrer" class="action-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Publisher Page
        </a>` : ""}
        ${pub.codeUrl ? `<a href="${escapeHTML(pub.codeUrl)}" target="_blank" rel="noopener noreferrer" class="action-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
          Repository
        </a>` : ""}
        <button type="button" class="action-btn" data-bibtex-id="${escapeHTML(pub.id)}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Cite BibTeX
        </button>
      </div>
    </article>
  `;
}

function renderCompactPublicationCard(pub) {
  return `
    <div class="pub-card-compact">
      <span class="pub-year-badge">${pub.year}</span>
      <div class="pub-compact-content">
        <h4><a href="#publications" data-section-link="publications">${escapeHTML(pub.title)}</a></h4>
        <p class="pub-compact-authors">${pub.authors.join(", ")}</p>
        <p class="pub-compact-venue"><em>${escapeHTML(pub.journal)}</em></p>
      </div>
    </div>
  `;
}

function bindCardButtons(root) {
  $$("[data-bibtex-id]", root).forEach((btn) => {
    btn.addEventListener("click", () => {
      const pubId = btn.getAttribute("data-bibtex-id");
      const pub = publications.find((p) => p.id === pubId);
      if (pub) {
        const bib = generateBibTeX(pub);
        copyText(bib, `BibTeX citation for ${pub.title}`);
        btn.textContent = "Copied!";
        setTimeout(() => {
          btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Cite BibTeX`;
        }, 2000);
      }
    });
  });
}
