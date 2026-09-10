/**
 * Software view component: renders 5 scientific software projects (TRAILS-MD, PathGennie,
 * IceCoder, SolOrder, we-trajectory-lineage) with interactive subtab navigation and verification status badges.
 */
import { softwareProjects } from "../data/software.js";
import { escapeHTML } from "../utils/escape-html.js";
import { copyText } from "../utils/clipboard.js";
import { setLiveStatus } from "../accessibility.js";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

let activeSoftwareId = "trails-md";

export function initSoftwareView() {
  renderHomeSoftwarePreview();
  renderSoftwareTabs();
  renderActiveSoftwareDetail();
}

export function renderHomeSoftwarePreview() {
  const container = $("#home-software-list");
  if (!container) return;

  container.innerHTML = softwareProjects.slice(0, 3).map((item) => `
    <div class="software-preview-card">
      <div class="software-preview-header">
        <h3><a href="#software/${escapeHTML(item.id)}" data-section-link="software" data-subroute="${escapeHTML(item.id)}">${escapeHTML(item.name)}</a></h3>
        <span class="badge badge-subtle">${escapeHTML(item.verificationStatus || item.language)}</span>
      </div>
      <p>${escapeHTML(item.tagline)}</p>
      <div class="software-preview-actions">
        <a href="${escapeHTML(item.repository)}" target="_blank" rel="noopener noreferrer" class="link-btn">GitHub →</a>
      </div>
    </div>
  `).join("");
}

function renderSoftwareTabs() {
  const navContainer = $("#software-tab-nav");
  if (!navContainer) return;

  navContainer.innerHTML = softwareProjects.map((item) => `
    <button
      class="software-tab-btn ${item.id === activeSoftwareId ? "is-active" : ""}"
      data-software-id="${escapeHTML(item.id)}"
      role="tab"
      aria-selected="${item.id === activeSoftwareId ? "true" : "false"}"
    >
      <span class="soft-name">${escapeHTML(item.name)}</span>
      <span class="soft-lang">${escapeHTML(item.language)}</span>
    </button>
  `).join("");

  $$("[data-software-id]", navContainer).forEach((btn) => {
    btn.addEventListener("click", () => {
      activeSoftwareId = btn.getAttribute("data-software-id");
      $$("[data-software-id]", navContainer).forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      renderActiveSoftwareDetail();
      setLiveStatus(`Showing ${activeSoftwareId} software details.`);
    });
  });
}

function renderActiveSoftwareDetail() {
  const container = $("#software-detail-container");
  if (!container) return;

  const item = softwareProjects.find((p) => p.id === activeSoftwareId) || softwareProjects[0];

  container.innerHTML = `
    <div class="software-detail-card" id="${escapeHTML(item.id)}">
      <div class="detail-header">
        <div class="header-main">
          <h2>${escapeHTML(item.name)}</h2>
          <p class="tagline">${escapeHTML(item.tagline)}</p>
        </div>
        <div class="header-badge-group">
          <span class="badge badge-primary">${escapeHTML(item.language)}</span>
          <span class="badge badge-subtle">${escapeHTML(item.license)} License</span>
          <span class="badge badge-info" title="Software verification status">${escapeHTML(item.verificationStatus || "Verified")}</span>
        </div>
      </div>

      <div class="detail-body">
        <div class="detail-section">
          <h4>Purpose & Overview</h4>
          <p>${escapeHTML(item.purpose)}</p>
        </div>

        <div class="detail-section">
          <h4>Key Capabilities</h4>
          <ul class="capabilities-list">
            ${item.capabilities.map((cap) => `<li>${escapeHTML(cap)}</li>`).join("")}
          </ul>
        </div>

        <div class="detail-section">
          <h4>Installation Command</h4>
          <div class="code-box">
            <code>${escapeHTML(item.installCommand)}</code>
            <button type="button" class="copy-code-btn" data-copy-code="${escapeHTML(item.installCommand)}">Copy</button>
          </div>
        </div>

        <div class="detail-section">
          <h4>Minimal Python Usage Example</h4>
          <pre class="code-block"><code>${escapeHTML(item.minimalUsage)}</code></pre>
        </div>

        <div class="detail-section">
          <h4>Dependencies & Platform</h4>
          <p><strong>Dependencies:</strong> ${item.dependencies.map((d) => `<code>${escapeHTML(d)}</code>`).join(", ")}</p>
          <p><strong>Supported Platforms:</strong> ${item.supportedSystems.join(", ")}</p>
        </div>
      </div>

      <div class="detail-footer">
        <a href="${escapeHTML(item.repository)}" target="_blank" rel="noopener noreferrer" class="primary-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
          View GitHub Repository
        </a>
      </div>
    </div>
  `;

  const copyBtn = $(".copy-code-btn", container);
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const code = copyBtn.getAttribute("data-copy-code");
      copyText(code, "Installation command");
      copyBtn.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.textContent = "Copy";
      }, 2000);
    });
  }
}
