/**
 * Accessibility utility module: live region announcements, focus restoration,
 * inert modal background management, and SVG description accessibility.
 */

const $ = (sel, root = document) => root.querySelector(sel);

let menuTrigger = null;

export function setLiveStatus(msg) {
  const el = $("#live-status");
  if (el) {
    el.textContent = msg;
  }
}

export function openMobileMenu() {
  const menu = $("#mobile-menu");
  const toggle = $(".menu-toggle");
  const main = $("#main");
  const header = $(".site-header");

  if (!menu) return;

  menuTrigger = document.activeElement || toggle;

  menu.classList.add("is-open");
  menu.setAttribute("aria-hidden", "false");
  if (toggle) toggle.setAttribute("aria-expanded", "true");

  if (main) main.inert = true;

  // Focus first link in drawer
  const firstLink = menu.querySelector("a");
  if (firstLink) {
    firstLink.focus();
  }

  setLiveStatus("Navigation menu opened.");
}

export function closeMobileMenu() {
  const menu = $("#mobile-menu");
  const toggle = $(".menu-toggle");
  const main = $("#main");

  if (!menu || !menu.classList.contains("is-open")) return;

  menu.classList.remove("is-open");
  menu.setAttribute("aria-hidden", "true");
  if (toggle) toggle.setAttribute("aria-expanded", "false");

  if (main) main.inert = false;

  if (menuTrigger && typeof menuTrigger.focus === "function") {
    menuTrigger.focus();
  }

  setLiveStatus("Navigation menu closed.");
}

export function setupMobileMenuEvents() {
  const toggle = $(".menu-toggle");
  const menu = $("#mobile-menu");

  if (toggle) {
    toggle.addEventListener("click", () => {
      if (menu?.classList.contains("is-open")) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  // Close menu on backdrop click
  if (menu) {
    menu.addEventListener("click", (e) => {
      if (e.target === menu) {
        closeMobileMenu();
      }
    });
  }

  // Close menu on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu?.classList.contains("is-open")) {
      closeMobileMenu();
    }
  });
}
