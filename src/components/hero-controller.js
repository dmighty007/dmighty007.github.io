/**
 * Hero Controller: handles WebGL 3D landscape initialization, 3Dmol.js protein viewer lazy loading,
 * WAI-ARIA tab navigation, adaptive quality profiling, and reduced-motion compliance.
 * Restored exact visual aesthetics and 3Dmol styling from commit 3861f38425c5690006273056ffc617d58df9fa6d.
 */
import { setLiveStatus } from "../accessibility.js";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

let threeLoaded = false;
let molLoaded = false;
let activeHeroTab = "fes";

export function initHeroController() {
  const heroGraphic = $(".research-graphic");
  if (!heroGraphic) return;

  setupHeroTabSemantics();

  // Lazy load Three.js when hero approaches viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadThreeJS(() => {
            initHeroScene();
          });
          observer.disconnect();
        }
      });
    },
    { rootMargin: "100px" }
  );

  observer.observe(heroGraphic);
}

function setupHeroTabSemantics() {
  const tabFes = $("#hero-tab-fes");
  const tabProtein = $("#hero-tab-protein");

  if (!tabFes || !tabProtein) return;

  const tabs = [tabFes, tabProtein];

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      switchHeroTab(tab.id === "hero-tab-fes" ? "fes" : "protein");
    });

    tab.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const nextTab = tab === tabFes ? tabProtein : tabFes;
        nextTab.focus();
        switchHeroTab(nextTab.id === "hero-tab-fes" ? "fes" : "protein");
      }
    });
  });
}

export function switchHeroTab(tabName) {
  const tabFes = $("#hero-tab-fes");
  const tabProtein = $("#hero-tab-protein");
  const sceneCanvas = $("#hero-scene");
  const molContainer = $("#protein-3dmol-container");

  if (!tabFes || !tabProtein) return;

  activeHeroTab = tabName;

  if (tabName === "fes") {
    tabFes.classList.add("is-active");
    tabFes.setAttribute("aria-selected", "true");
    tabFes.setAttribute("tabindex", "0");

    tabProtein.classList.remove("is-active");
    tabProtein.setAttribute("aria-selected", "false");
    tabProtein.setAttribute("tabindex", "-1");

    if (sceneCanvas) sceneCanvas.classList.remove("is-inactive");
    if (molContainer) molContainer.classList.remove("is-active");

    setLiveStatus("Showing Free-Energy Surface V(q) landscape.");
  } else {
    tabProtein.classList.add("is-active");
    tabProtein.setAttribute("aria-selected", "true");
    tabProtein.setAttribute("tabindex", "0");

    tabFes.classList.remove("is-active");
    tabFes.setAttribute("aria-selected", "false");
    tabFes.setAttribute("tabindex", "-1");

    if (sceneCanvas) sceneCanvas.classList.add("is-inactive");
    if (molContainer) molContainer.classList.add("is-active");

    setLiveStatus("Showing Protein Cartoon 3D structure.");

    // Lazy load 3Dmol.js when protein tab is selected
    if (!molLoaded) {
      if (molContainer) {
        molContainer.innerHTML = `<div class="mol-loading" style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);font-size:0.85rem;gap:0.5rem;"><span class="mol-spinner" style="width:16px;height:16px;border:2px solid var(--border);border-top-color:var(--teal);border-radius:50%;animation:mol-spin 0.8s linear infinite;"></span> Loading protein viewer…</div>`;
      }
      load3DmolJS(() => {
        initProteinViewer();
      });
    }
  }
}

function loadThreeJS(callback) {
  if (window.THREE) {
    threeLoaded = true;
    if (callback) callback();
    return;
  }

  const script = document.createElement("script");
  script.src = "./js/vendor/three.min.js";
  script.onload = () => {
    threeLoaded = true;
    const sceneScript = document.createElement("script");
    sceneScript.src = "./js/hero-scene.js";
    sceneScript.onload = () => {
      if (callback) callback();
    };
    document.body.appendChild(sceneScript);
  };
  document.body.appendChild(script);
}

function load3DmolJS(callback) {
  if (window.$3Dmol) {
    molLoaded = true;
    if (callback) callback();
    return;
  }

  const script = document.createElement("script");
  script.src = "./js/vendor/3Dmol-min.js";
  script.onload = () => {
    molLoaded = true;
    if (callback) callback();
  };
  document.body.appendChild(script);
}

function initHeroScene() {
  if (window.initHeroSceneScript) {
    window.initHeroSceneScript();
  }
  const poster = $("#hero-poster");
  if (poster) {
    poster.style.opacity = "0";
    setTimeout(() => {
      poster.style.display = "none";
    }, 500);
  }
}

function initProteinViewer() {
  const container = $("#protein-3dmol-container");
  if (!container || !window.$3Dmol) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (window.location.protocol === "file:") {
    container.innerHTML = `
      <div style="padding: 20px; text-align: center; color: var(--text-secondary); font-size: 0.9rem;">
        <p><strong>Protein Structure View</strong></p>
        <p>To view 3D molecular cartoons, please serve the portfolio over HTTP/HTTPS (e.g. <code>python3 -m http.server</code>).</p>
      </div>
    `;
    return;
  }

  fetch("./js/vendor/1ubq.pdb")
    .then((res) => res.text())
    .then((pdbData) => {
      container.innerHTML = "";
      const viewer = window.$3Dmol.createViewer(container, {
        backgroundColor: "0xfffdf8",
        antialias: true
      });
      viewer.addModel(pdbData, "pdb");

      // Custom publication cartoon style from commit 3861f38
      viewer.setStyle({}, { cartoon: { color: "spectrum", thickness: 0.38 } });
      viewer.setStyle({ ss: "h" }, { cartoon: { color: "#3c7a76", style: "oval" } });
      viewer.setStyle({ ss: "s" }, { cartoon: { color: "#1e3552", style: "arrow" } });
      viewer.setStyle({ ss: "c" }, { cartoon: { color: "#9a6048", thickness: 0.25 } });
      viewer.addStyle({ resn: ["PHE", "TYR", "TRP", "MET", "HIS"] }, { stick: { colorscheme: "amino", radius: 0.15 } });

      viewer.zoomTo();
      viewer.render();

      if (!reduceMotion) {
        viewer.spin("y", 0.7);
      }
    })
    .catch((err) => {
      console.warn("Could not load PDB asset:", err);
      container.innerHTML = `<div style="padding: 20px; text-align: center;">Ubiquitin 3D Structure (1UBQ)</div>`;
    });
}
