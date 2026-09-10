/**
 * Application Entry Point (main.js)
 * Initializes routing, accessibility, views, hero controller, and event listeners.
 */

import { initNavigation } from "./navigation.js";
import { setupMobileMenuEvents } from "./accessibility.js";
import { initHeroController } from "./components/hero-controller.js";
import { initPublicationsView, renderPublications, renderSelectedPublicationsHome } from "./components/publications-view.js";
import { renderResearchView, renderFeaturedCardsHome } from "./components/research-view.js";
import { initSoftwareView } from "./components/software-view.js";
import { renderCVView } from "./components/cv-view.js";
import { publications } from "./data/publications.js";
import { softwareProjects } from "./data/software.js";

const $ = (sel, root = document) => root.querySelector(sel);

document.addEventListener("DOMContentLoaded", () => {
  // Initialize mobile menu & accessibility handlers
  setupMobileMenuEvents();

  // Populate hero statistics
  updateAboutStats();

  // Initialize views
  renderFeaturedCardsHome();
  renderSelectedPublicationsHome();
  renderResearchView();
  initPublicationsView();
  initSoftwareView();
  renderCVView();

  // Initialize Hero Scene & Controller
  initHeroController();

  // Initialize router
  initNavigation((section, subroute) => {
    // Re-render subroute targets if needed
    if (section === "publications") {
      renderPublications();
    }
  });

  // Wire scroll progress bar
  initScrollProgress();

  // Scroll-triggered reveal animations
  initRevealAnimations();
});

function updateAboutStats() {
  const statPubs = $("#stat-publications");
  const statPeer = $("#stat-peer-reviewed");
  const statSoft = $("#stat-software");

  const peerCount = publications.filter((p) => p.status === "peer-reviewed").length;

  if (statPubs) statPubs.textContent = publications.length;
  if (statPeer) statPeer.textContent = peerCount;
  if (statSoft) statSoft.textContent = softwareProjects.length;
}

function initScrollProgress() {
  const progress = $("#scroll-progress");
  if (!progress) return;

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progress.style.width = `${pct}%`;
  }, { passive: true });
}

function initRevealAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}
