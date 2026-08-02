/**
 * Router & Navigation management module supporting deep routes (#research/pathgennie).
 */
import { setLiveStatus, closeMobileMenu } from "./accessibility.js";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export let currentSection = "home";
export let currentSubroute = null;

const sectionTitles = {
  home: "Dibyendu Maity | Computational Molecular Scientist",
  research: "Research Case Studies | Dibyendu Maity",
  publications: "Publications & Preprints | Dibyendu Maity",
  software: "Scientific Software & Code | Dibyendu Maity",
  about: "About & Academic History | Dibyendu Maity",
  contact: "Contact & Collaboration | Dibyendu Maity",
  cv: "Academic CV | Dibyendu Maity"
};

export function initNavigation(onRouteChanged) {
  window.addEventListener("hashchange", () => {
    handleHashRoute(onRouteChanged);
  });

  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-section-link]");
    if (!link) return;

    const targetSection = link.getAttribute("data-section-link");
    if (!targetSection) return;

    // Check subroute attribute if present
    const subroute = link.getAttribute("data-subroute");

    e.preventDefault();
    closeMobileMenu();

    if (subroute) {
      window.location.hash = `${targetSection}/${subroute}`;
    } else {
      window.location.hash = targetSection;
    }
  });

  // Initial page load routing
  handleHashRoute(onRouteChanged);
}

function handleHashRoute(onRouteChanged) {
  const hash = window.location.hash.replace("#", "").trim();
  let section = "home";
  let subroute = null;

  if (hash) {
    const parts = hash.split("/");
    section = parts[0] || "home";
    subroute = parts[1] || null;
  }

  const validSections = ["home", "research", "publications", "software", "about", "contact", "cv"];
  if (!validSections.includes(section)) {
    section = "home";
  }

  currentSection = section;
  currentSubroute = subroute;

  activateSection(section, subroute);

  if (document.title !== (sectionTitles[section] || sectionTitles.home)) {
    document.title = sectionTitles[section] || sectionTitles.home;
  }

  setLiveStatus(`Showing ${section.charAt(0).toUpperCase() + section.slice(1)} section`);

  if (typeof onRouteChanged === "function") {
    onRouteChanged(section, subroute);
  }
}

function activateSection(sectionId, subroute) {
  $$(".page-section").forEach((sec) => {
    sec.classList.remove("is-active");
  });

  const activeSec = $(`[data-section="${sectionId}"]`);
  if (activeSec) {
    activeSec.classList.add("is-active");
  }

  $$("[data-section-link]").forEach((link) => {
    const target = link.getAttribute("data-section-link");
    if (target === sectionId) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("is-active");
      link.removeAttribute("aria-current");
    }
  });

  // Scroll to top or specific element if subroute exists
  if (subroute) {
    const targetEl = $(`#${subroute}`) || $(`[data-subroute-id="${subroute}"]`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
      return;
    }
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}
