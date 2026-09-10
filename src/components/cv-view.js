/**
 * CV view component: renders accessible HTML CV with dual actions (Download PDF & Print/Save).
 */
import { awardsAndRecognition, conferenceActivities } from "../data/activities.js";
import { educationTimeline } from "../data/education.js";
import { publications } from "../data/publications.js";
import { softwareProjects } from "../data/software.js";
import { escapeHTML } from "../utils/escape-html.js";

const $ = (sel, root = document) => root.querySelector(sel);

function renderConferenceActivity(activity) {
    const title = activity.title ? `, <em>${escapeHTML(activity.title)}</em>` : "";
    const distinction = activity.distinction ? ` <span class="cv-note">${escapeHTML(activity.distinction)}</span>` : "";
    const details = [activity.event, activity.institution, activity.location, activity.date]
        .filter(Boolean)
        .map(escapeHTML)
        .join(", ");

    return `
    <li><strong>${escapeHTML(activity.role)}</strong>${title}, ${details}.${distinction}</li>
  `;
}

export function renderCVView() {
    const container = $("#cv-container");
    if (!container) return;

    const peerReviewed = publications.filter(p => p.status === "peer-reviewed");
    const preprints = publications.filter(p => p.status === "preprint");
    const submitted = publications.filter(p => p.status === "submitted");

    container.innerHTML = `
    <div class="cv-wrapper">
      <div class="cv-toolbar">
        <div class="cv-toolbar-meta">
          <span class="badge badge-primary">Academic CV · Updated August 2026</span>
          <span class="cv-last-updated">Ph.D. Thesis Submitted</span>
        </div>
        <div class="cv-toolbar-actions">
          <a href="./assets/dibyendumaity-cv.pdf" download="Dibyendu_Maity_CV.pdf" class="primary-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download PDF CV
          </a>
          <button type="button" class="secondary-button" id="cv-print-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Print / Save HTML
          </button>
        </div>
      </div>

      <article class="cv-paper">
        <header class="cv-header">
          <h1>Dibyendu Maity</h1>
          <p class="cv-subtitle">Ph.D. in Physics (Theoretical) · Computational Biophysics</p>
          <div class="cv-contact-bar">
            <span>Anikola, Dantan, Paschim Medinipur, West Bengal 721457</span> ·
            <a href="tel:+918158055918">8158055918</a> ·
            <a href="mailto:dibyendumaity1999@gmail.com">dibyendumaity1999@gmail.com</a> ·
            <a href="mailto:dibyendumaity1999@bose.res.in">dibyendumaity1999@bose.res.in</a>
          </div>
        </header>

        <section class="cv-section">
          <h2>Academic Availability & Status</h2>
          <p><strong>Ph.D. thesis submitted, University of Calcutta.</strong> Available for postdoctoral research positions from <strong>late 2026</strong>.</p>
        </section>

        <section class="cv-section">
          <h2>Education</h2>
          ${educationTimeline
              .map(
                  edu => `
            <div class="cv-entry">
              <div class="cv-entry-header">
                <strong>${escapeHTML(edu.degree)}</strong>
                <span>${escapeHTML(edu.period)}</span>
              </div>
              <p class="cv-institution">${escapeHTML(edu.institution)}</p>
              ${edu.grade ? `<p class="cv-detail"><strong>Marks:</strong> ${escapeHTML(edu.grade)}</p>` : ""}
              ${edu.thesisTitle ? `<p class="cv-detail"><strong>Thesis Title:</strong> <em>${escapeHTML(edu.thesisTitle)}</em></p>` : ""}
              ${edu.advisor ? `<p class="cv-detail"><strong>Advisor:</strong> ${escapeHTML(edu.advisor)}</p>` : ""}
            </div>
          `,
              )
              .join("")}
        </section>

        <section class="cv-section">
          <h2>Publications Record</h2>
          <ol class="cv-pub-list">
            ${peerReviewed
                .map(
                    p => `
              <li>${p.authors.join(", ")}. ${escapeHTML(p.title)}. <em>${escapeHTML(p.journal)}</em> <strong>${p.year}</strong>${p.volume ? `, ${p.volume}` : ""}${p.pages ? `, ${p.pages}` : ""}. DOI: <code>${p.doi}</code>.</li>
            `,
                )
                .join("")}

            ${[...preprints, ...submitted]
                .map(
                    p => `
              <li>${p.authors.join(", ")}. ${escapeHTML(p.title)}. <em>${escapeHTML(p.journal)}</em> <strong>${p.year}</strong>. ${p.doi ? `DOI: <code>${p.doi}</code>` : "Submitted"}.</li>
            `,
                )
                .join("")}
          </ol>
        </section>

        <section class="cv-section">
          <h2>Scientific Software Development</h2>
          <ul class="cv-list">
            ${softwareProjects
                .map(
                    s => `
              <li><strong>${escapeHTML(s.name)}</strong> (${escapeHTML(s.language)}): ${escapeHTML(s.tagline)} <br><small>URL: <a href="${escapeHTML(s.repository)}" target="_blank" rel="noopener noreferrer">${escapeHTML(s.repository)}</a></small></li>
            `,
                )
                .join("")}
          </ul>
        </section>

        <section class="cv-section">
          <h2>Conference Presentations and Participation</h2>
          <ul class="cv-list">
            ${conferenceActivities.map(renderConferenceActivity).join("")}
          </ul>
        </section>

        <section class="cv-section">
          <h2>Awards and Recognition</h2>
          <ul class="cv-list">
            ${awardsAndRecognition
                .map(
                    award => `
              <li><strong>${escapeHTML(award.title)}</strong>, ${escapeHTML(award.institution)} (${escapeHTML(award.date)}). ${escapeHTML(award.detail)}</li>
            `,
                )
                .join("")}
          </ul>
        </section>

        <section class="cv-section">
          <h2>Technical & Computational Skills</h2>
          <p><strong>Molecular simulation:</strong> Molecular Dynamics, Enhanced Sampling, Metadynamics, Umbrella Sampling, Adaptive Sampling, Rare-Event Sampling, Langevin Dynamics, Weighted Ensemble.</p>
          <p><strong>Machine Learning:</strong> Representation Learning, Autoencoders, Variational Autoencoders, Deep Learning, data-driven collective variables, pathway analysis.</p>
          <p><strong>Programming:</strong> Python, NumPy, SciPy, PyTorch, MDAnalysis, MDTraj, C++, Bash.</p>
          <p><strong>Simulation / Scientific Software:</strong> GROMACS, OpenMM, PLUMED, Git, Linux/HPC clusters.</p>
        </section>
      </article>
    </div>
  `;

    const printBtn = $("#cv-print-btn");
    if (printBtn) {
        printBtn.addEventListener("click", () => {
            window.print();
        });
    }
}
