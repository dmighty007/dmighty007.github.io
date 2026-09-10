/**
 * Research view component: renders flagship research cards with SVG schematics
 * and dedicated Postdoctoral Research Fit programmes.
 */
import { researchThemes } from "../data/research.js";
import { researchFitProgrammes } from "../data/research-fit.js";
import { escapeHTML } from "../utils/escape-html.js";

const $ = (sel, root = document) => root.querySelector(sel);

function getSchematicDiagram(id) {
  if (id === "pathgennie") {
    return `
      <div class="case-study-schematic" aria-label="PathGennie Direction-Guided Adaptive Sampling Schematic">
        <svg viewBox="0 0 760 140" width="100%" height="140" xmlns="http://www.w3.org/2000/svg" role="img">
          <title>PathGennie Direction-Guided Adaptive Sampling Schematic</title>
          <desc>Diagram showing parallel short MD segments steered along progress coordinates toward transition state.</desc>
          <rect width="760" height="140" rx="8" fill="#f2ebd9" />
          <!-- Energy Landscape Curve -->
          <path d="M 40,110 C 140,20 240,120 380,35 C 500,-10 600,120 720,110" fill="none" stroke="#ded4be" stroke-width="4" />
          <!-- Minimum Energy Path -->
          <path d="M 40,105 C 140,25 240,115 380,40 C 500,0 600,115 720,105" fill="none" stroke="#9a6048" stroke-width="2.5" stroke-dasharray="6,4" />
          
          <!-- Parallel Spawns / Trajectories -->
          <circle cx="80" cy="95" r="7" fill="#3c7a76" />
          <path d="M 80,95 Q 110,80 135,75" fill="none" stroke="#3c7a76" stroke-width="2" />
          <circle cx="135" cy="75" r="5" fill="#3c7a76" />
          
          <path d="M 135,75 Q 170,60 210,82" fill="none" stroke="#3c7a76" stroke-width="2" />
          <circle cx="210" cy="82" r="5" fill="#3c7a76" />

          <!-- Directional Steering Node at Barrier -->
          <circle cx="380" cy="40" r="9" fill="#b8863a" stroke="#fffdf8" stroke-width="2" />
          <text x="380" y="22" font-size="11" font-weight="bold" fill="#16283e" text-anchor="middle">Directional Steering</text>
          
          <path d="M 380,40 Q 450,25 520,60" fill="none" stroke="#1e3552" stroke-width="2" />
          <circle cx="520" cy="60" r="5" fill="#1e3552" />
          
          <path d="M 520,60 Q 610,95 680,100" fill="none" stroke="#1e3552" stroke-width="2" />
          <circle cx="680" cy="100" r="7" fill="#1e3552" />

          <!-- Labels -->
          <text x="75" y="125" font-size="11" font-weight="600" fill="#3c7a76" text-anchor="middle">Basin A (State 1)</text>
          <text x="685" y="125" font-size="11" font-weight="600" fill="#1e3552" text-anchor="middle">Basin B (State 2)</text>
          <text x="560" y="45" font-size="10" fill="#5b564c">Parallel Short MD Spawns (50-100 ps)</text>
        </svg>
      </div>
    `;
  }
  if (id === "icecoder") {
    return `
      <div class="case-study-schematic" aria-label="IceCoder SOAP-VAE Unsupervised Phase Identification Schematic">
        <svg viewBox="0 0 760 140" width="100%" height="140" xmlns="http://www.w3.org/2000/svg" role="img">
          <title>IceCoder SOAP-VAE Unsupervised Phase Identification Schematic</title>
          <desc>Diagram showing local SOAP atomic environment descriptors encoded into a 2D VAE latent space with Ice Ih, Ice Ic, and liquid clusters.</desc>
          <rect width="760" height="140" rx="8" fill="#f2ebd9" />
          
          <!-- SOAP Atomic Environments -->
          <g transform="translate(60, 40)">
            <rect x="0" y="0" width="120" height="65" rx="6" fill="#fffdf8" stroke="#c9bca0" stroke-width="1.5" />
            <text x="60" y="25" font-size="11" font-weight="bold" fill="#1e3552" text-anchor="middle">SOAP Descriptors</text>
            <text x="60" y="45" font-size="10" fill="#6f675b" text-anchor="middle">Local Atomic Density ρ(r)</text>
          </g>

          <!-- Encoder Arrow -->
          <path d="M 195,72.5 L 245,72.5" stroke="#b8863a" stroke-width="2.5" marker-end="url(#arrow)" />
          <text x="220" y="62" font-size="10" font-weight="600" fill="#b8863a" text-anchor="middle">Encoder</text>

          <!-- VAE Bottleneck -->
          <g transform="translate(260, 35)">
            <polygon points="0,0 60,20 60,45 0,65" fill="#3c7a76" opacity="0.15" stroke="#3c7a76" stroke-width="1.5" />
            <text x="30" y="37" font-size="10" font-weight="bold" fill="#3c7a76" text-anchor="middle">latent μ, σ</text>
          </g>

          <!-- Arrow to Latent Space -->
          <path d="M 335,72.5 L 385,72.5" stroke="#3c7a76" stroke-width="2.5" />

          <!-- Latent Space 2D Clusters -->
          <g transform="translate(410, 20)">
            <rect x="0" y="0" width="290" height="100" rx="6" fill="#fffdf8" stroke="#c9bca0" stroke-width="1.5" />
            <text x="145" y="18" font-size="11" font-weight="bold" fill="#16283e" text-anchor="middle">Low-Dimensional Latent Space (z₁, z₂)</text>

            <!-- Cluster 1: Ih -->
            <circle cx="50" cy="55" r="18" fill="rgba(60, 122, 118, 0.2)" stroke="#3c7a76" stroke-width="1.5" />
            <text x="50" y="58" font-size="10" font-weight="bold" fill="#3c7a76" text-anchor="middle">Hexagonal (Iₕ)</text>

            <!-- Cluster 2: Ic -->
            <circle cx="145" cy="45" r="18" fill="rgba(184, 134, 58, 0.2)" stroke="#b8863a" stroke-width="1.5" />
            <text x="145" y="48" font-size="10" font-weight="bold" fill="#b8863a" text-anchor="middle">Cubic (I꜀)</text>

            <!-- Cluster 3: Liquid -->
            <circle cx="235" cy="65" r="22" fill="rgba(30, 53, 82, 0.2)" stroke="#1e3552" stroke-width="1.5" />
            <text x="235" y="68" font-size="10" font-weight="bold" fill="#1e3552" text-anchor="middle">Liquid H₂O</text>
          </g>
        </svg>
      </div>
    `;
  }
  if (id === "trails-md") {
    return `
      <div class="case-study-schematic" aria-label="TRAILS-MD Lineage Tree Forest Schematic">
        <svg viewBox="0 0 760 140" width="100%" height="140" xmlns="http://www.w3.org/2000/svg" role="img">
          <title>TRAILS-MD Lineage Tree Forest Schematic</title>
          <desc>Diagram showing continuous lineage forest reconstruction connecting parallel short MD trajectory fragments.</desc>
          <rect width="760" height="140" rx="8" fill="#f2ebd9" />

          <!-- Lineage Tree Nodes & Branches -->
          <g transform="translate(60, 20)">
            <text x="320" y="18" font-size="11" font-weight="bold" fill="#16283e" text-anchor="middle">Lineage Forest & Continuous Pathway Reconstruction</text>
            
            <!-- Generation 0 (Root) -->
            <circle cx="40" cy="60" r="8" fill="#3c7a76" />
            <text x="40" y="82" font-size="10" fill="#3c7a76" text-anchor="middle">Seed 0</text>

            <!-- Generation 1 Branches -->
            <line x1="48" y1="60" x2="160" y2="35" stroke="#3c7a76" stroke-width="2" />
            <line x1="48" y1="60" x2="160" y2="85" stroke="#3c7a76" stroke-width="2" />
            <circle cx="160" cy="35" r="6" fill="#3c7a76" />
            <circle cx="160" cy="85" r="6" fill="#6f675b" opacity="0.5" />

            <!-- Generation 2 Branches -->
            <line x1="166" y1="35" x2="300" y2="30" stroke="#b8863a" stroke-width="2" />
            <line x1="166" y1="35" x2="300" y2="60" stroke="#b8863a" stroke-width="2" />
            <circle cx="300" cy="30" r="6" fill="#b8863a" />
            <circle cx="300" cy="60" r="6" fill="#b8863a" />

            <!-- Generation 3 Branches -->
            <line x1="306" y1="30" x2="450" y2="45" stroke="#9a6048" stroke-width="2" />
            <line x1="306" y1="60" x2="450" y2="75" stroke="#9a6048" stroke-width="2" />
            <circle cx="450" cy="45" r="6" fill="#9a6048" />
            <circle cx="450" cy="75" r="6" fill="#9a6048" />

            <!-- Reconstructed Continuous Transition Line -->
            <path d="M 40,60 L 160,35 L 300,30 L 450,45 L 580,55" fill="none" stroke="#9a6048" stroke-width="3" stroke-dasharray="4,2" />
            <circle cx="580" cy="55" r="9" fill="#1e3552" />
            <text x="580" y="78" font-size="10" font-weight="bold" fill="#1e3552" text-anchor="middle">Target State</text>

            <rect x="200" y="95" width="240" height="20" rx="4" fill="#fffdf8" stroke="#c9bca0" />
            <text x="320" y="109" font-size="10" font-weight="500" fill="#5b564c" text-anchor="middle">Density-Based Resampling without Fragmentation</text>
          </g>
        </svg>
      </div>
    `;
  }
  if (id === "solvation-transferability") {
    return `
      <div class="case-study-schematic" aria-label="Solvation Transferability Representation Learning Schematic">
        <svg viewBox="0 0 760 140" width="100%" height="140" xmlns="http://www.w3.org/2000/svg" role="img">
          <title>Solvation Transferability Representation Learning Schematic</title>
          <desc>Diagram showing 2D chemical graph and 3D conformer embeddings evaluated for domain transferability in solvation energy prediction.</desc>
          <rect width="760" height="140" rx="8" fill="#f2ebd9" />

          <!-- Input Embeddings -->
          <g transform="translate(50, 30)">
            <rect x="0" y="0" width="160" height="80" rx="6" fill="#fffdf8" stroke="#c9bca0" stroke-width="1.5" />
            <text x="80" y="25" font-size="11" font-weight="bold" fill="#1e3552" text-anchor="middle">Representation Stack</text>
            <text x="80" y="45" font-size="10" fill="#3c7a76" text-anchor="middle">• 2D Graph Embeddings</text>
            <text x="80" y="62" font-size="10" fill="#b8863a" text-anchor="middle">• 3D Conformer Statistics</text>
          </g>

          <path d="M 220,70 L 290,70" stroke="#b8863a" stroke-width="2.5" />

          <!-- Domain-Aware Evaluation -->
          <g transform="translate(300, 30)">
            <rect x="0" y="0" width="180" height="80" rx="6" fill="#fffdf8" stroke="#c9bca0" stroke-width="1.5" />
            <text x="90" y="25" font-size="11" font-weight="bold" fill="#16283e" text-anchor="middle">Domain-Aware Split</text>
            <text x="90" y="45" font-size="10" fill="#5b564c" text-anchor="middle">Out-of-Distribution Solvents</text>
            <text x="90" y="62" font-size="10" fill="#5b564c" text-anchor="middle">Leakage Control</text>
          </g>

          <path d="M 490,70 L 550,70" stroke="#3c7a76" stroke-width="2.5" />

          <!-- Property Prediction Result -->
          <g transform="translate(560, 30)">
            <rect x="0" y="0" width="150" height="80" rx="6" fill="#fffdf8" stroke="#3c7a76" stroke-width="1.5" />
            <text x="75" y="25" font-size="11" font-weight="bold" fill="#3c7a76" text-anchor="middle">ΔG_solv Prediction</text>
            <text x="75" y="45" font-size="10" font-weight="600" fill="#1e3552" text-anchor="middle">Transferability Assessment</text>
            <text x="75" y="62" font-size="9" fill="#9a6048" text-anchor="middle">Shielded Polar Group Rules</text>
          </g>
        </svg>
      </div>
    `;
  }
  return "";
}

export function renderResearchView() {
  renderFeaturedCardsHome();
  renderDetailedResearchCards();
  renderResearchFitSection();
}

export function renderFeaturedCardsHome() {
  const container = $("#featured-research-cards");
  if (!container) return;

  container.innerHTML = researchThemes.slice(0, 3).map((item) => `
    <article class="research-card">
      <div class="card-header">
        <span class="card-status">${escapeHTML(item.status)}</span>
        <h3>${escapeHTML(item.title)}</h3>
      </div>
      <p class="card-subtitle"><em>${escapeHTML(item.subtitle)}</em></p>
      <div class="card-body">
        <p><strong>Quantitative Result:</strong> ${escapeHTML(item.result)}</p>
      </div>
      <div class="card-footer">
        <a href="#research/${escapeHTML(item.id)}" data-section-link="research" data-subroute="${escapeHTML(item.id)}" class="card-link">View case study →</a>
      </div>
    </article>
  `).join("");
}

function renderDetailedResearchCards() {
  const container = $("#detailed-research-list");
  if (!container) return;

  container.innerHTML = researchThemes.map((item) => `
    <article class="research-case-study" id="${escapeHTML(item.id)}">
      <div class="case-study-header">
        <div class="case-study-meta">
          <span class="badge badge-primary">${escapeHTML(item.status)}</span>
          ${item.thesisRef ? `<span class="badge badge-subtle">${escapeHTML(item.thesisRef)}</span>` : ""}
        </div>
        <h2>${escapeHTML(item.title)}</h2>
        <p class="case-study-subtitle">${escapeHTML(item.subtitle)}</p>
      </div>

      ${getSchematicDiagram(item.id)}

      <div class="case-study-grid">
        <div class="case-study-block">
          <h4>Scientific Problem</h4>
          <p>${escapeHTML(item.problem)}</p>
        </div>

        <div class="case-study-block">
          <h4>Methodological Contribution</h4>
          <p>${escapeHTML(item.methodology)}</p>
        </div>

        <div class="case-study-block highlight-block">
          <h4>Quantitative Result & Validation</h4>
          <p>${escapeHTML(item.result)}</p>
        </div>

        <div class="case-study-block">
          <h4>My Specific Role</h4>
          <p>${escapeHTML(item.contributionStatement)}</p>
        </div>
      </div>

      <div class="case-study-actions">
        ${item.pubUrl ? `<a href="${escapeHTML(item.pubUrl)}" target="_blank" rel="noopener noreferrer" class="primary-button">View Publication</a>` : ""}
        ${item.codeUrl ? `<a href="${escapeHTML(item.codeUrl)}" target="_blank" rel="noopener noreferrer" class="secondary-button">GitHub Repository</a>` : ""}
      </div>
    </article>
  `).join("");
}

function renderResearchFitSection() {
  const container = $("#research-fit-container");
  if (!container) return;

  container.innerHTML = researchFitProgrammes.map((prog, index) => `
    <div class="fit-programme-card">
      <div class="fit-programme-header">
        <span class="fit-index">0${index + 1}</span>
        <h3>${escapeHTML(prog.title)}</h3>
      </div>
      <p class="fit-tagline"><em>${escapeHTML(prog.tagline)}</em></p>
      
      <div class="fit-flow">
        <div class="fit-step">
          <span class="step-label">Previous Foundation</span>
          <p>${escapeHTML(prog.foundation)}</p>
        </div>
        <div class="fit-step">
          <span class="step-label">Unresolved Question</span>
          <p>${escapeHTML(prog.unresolvedQuestion)}</p>
        </div>
        <div class="fit-step">
          <span class="step-label">Proposed Next Method</span>
          <p>${escapeHTML(prog.proposedMethod)}</p>
        </div>
        <div class="fit-step">
          <span class="step-label">Target Systems</span>
          <p>${escapeHTML(prog.targetSystems)}</p>
        </div>
      </div>
    </div>
  `).join("");
}
