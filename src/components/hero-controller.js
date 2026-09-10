/** A dependency-free free-energy landscape explorer with a reliable SVG fallback. */
import { setLiveStatus } from "../accessibility.js";

const $ = (selector) => document.querySelector(selector);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const RANGE = { x: [-3.3, 3.3], y: [-2.35, 2.35] };
const basinA = { x: -1.45, y: 0.72 };
const basinB = { x: 1.42, y: -0.66 };

function energy(x, y) {
  const left = Math.exp(-(((x - basinA.x) ** 2) / 0.72 + ((y - basinA.y) ** 2) / 0.52));
  const right = Math.exp(-(((x - basinB.x) ** 2) / 0.76 + ((y - basinB.y) ** 2) / 0.62));
  const barrier = Math.exp(-((x ** 2) / 0.78 + (y ** 2) / 0.95));
  return 0.08 * (x * x + y * y) - 1.06 * left - 0.98 * right + 0.45 * barrier;
}

function colorAt(value) {
  const t = Math.max(0, Math.min(1, (value + 1.05) / 1.6));
  const stops = [[27, 56, 79], [55, 113, 116], [150, 184, 175], [239, 231, 211], [184, 134, 58]];
  const scaled = t * (stops.length - 1);
  const index = Math.min(stops.length - 2, Math.floor(scaled));
  const mix = scaled - index;
  return stops[index].map((channel, i) => Math.round(channel + (stops[index + 1][i] - channel) * mix));
}

export function initHeroController() {
  const canvas = $("#hero-landscape");
  if (!canvas) return;
  const context = canvas.getContext("2d");
  if (!context) return;
  const poster = $("#hero-poster");
  const status = $("#landscape-status");
  const toggle = $("#hero-toggle-anim");
  const reset = $("#hero-reset-anim");
  let paused = reduceMotion;
  let progress = 0;
  let lastFrame = performance.now();
  let hover = null;

  const toScreen = (x, y, width, height) => [((x - RANGE.x[0]) / (RANGE.x[1] - RANGE.x[0])) * width, ((y - RANGE.y[0]) / (RANGE.y[1] - RANGE.y[0])) * height];
  const toWorld = (x, y, width, height) => [RANGE.x[0] + (x / width) * (RANGE.x[1] - RANGE.x[0]), RANGE.y[0] + (y / height) * (RANGE.y[1] - RANGE.y[0])];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * ratio));
    canvas.height = Math.max(1, Math.round(rect.height * ratio));
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function field(width, height) {
    const ratio = Math.min(1, 260 / Math.max(width, height));
    const sampleWidth = Math.max(110, Math.round(width * ratio));
    const sampleHeight = Math.max(80, Math.round(height * ratio));
    const image = context.createImageData(sampleWidth, sampleHeight);
    for (let py = 0; py < sampleHeight; py += 1) for (let px = 0; px < sampleWidth; px += 1) {
      const [x, y] = toWorld(px + 0.5, py + 0.5, sampleWidth, sampleHeight);
      const [r, g, b] = colorAt(energy(x, y));
      const offset = (py * sampleWidth + px) * 4;
      image.data.set([r, g, b, 255], offset);
    }
    const buffer = document.createElement("canvas");
    buffer.width = sampleWidth; buffer.height = sampleHeight;
    buffer.getContext("2d").putImageData(image, 0, 0);
    context.drawImage(buffer, 0, 0, sampleWidth, sampleHeight, 0, 0, width, height);
  }

  function contours(width, height) {
    const levels = [-0.9, -0.72, -0.54, -0.36, -0.18, 0, 0.18, 0.36];
    const columns = 40; const rows = 28;
    context.strokeStyle = "rgba(23, 56, 79, .28)"; context.lineWidth = 0.75;
    levels.forEach((level) => {
      for (let row = 0; row < rows; row += 1) for (let col = 0; col < columns; col += 1) {
        const x0 = RANGE.x[0] + (col / columns) * (RANGE.x[1] - RANGE.x[0]);
        const x1 = RANGE.x[0] + ((col + 1) / columns) * (RANGE.x[1] - RANGE.x[0]);
        const y0 = RANGE.y[0] + (row / rows) * (RANGE.y[1] - RANGE.y[0]);
        const y1 = RANGE.y[0] + ((row + 1) / rows) * (RANGE.y[1] - RANGE.y[0]);
        const values = [energy(x0, y0), energy(x1, y0), energy(x1, y1), energy(x0, y1)];
        const edges = [[0, 1, x0, y0, x1, y0], [1, 2, x1, y0, x1, y1], [2, 3, x1, y1, x0, y1], [3, 0, x0, y1, x0, y0]];
        const points = edges.flatMap(([a, b, ax, ay, bx, by]) => ((values[a] <= level) !== (values[b] <= level) ? [[ax + (bx - ax) * ((level - values[a]) / (values[b] - values[a])), ay + (by - ay) * ((level - values[a]) / (values[b] - values[a]))]] : []));
        if (points.length === 2) { context.beginPath(); context.moveTo(...toScreen(...points[0], width, height)); context.lineTo(...toScreen(...points[1], width, height)); context.stroke(); }
      }
    });
  }

  function pathPoint(t) {
    const inverse = 1 - t;
    return { x: inverse ** 2 * basinA.x + 2 * inverse * t * 0.05 + t ** 2 * basinB.x, y: inverse ** 2 * basinA.y + 2 * inverse * t * -1.36 + t ** 2 * basinB.y };
  }

  function path(width, height) {
    context.beginPath();
    for (let i = 0; i <= 90; i += 1) { const point = pathPoint(i / 90); const screen = toScreen(point.x, point.y, width, height); if (!i) context.moveTo(...screen); else context.lineTo(...screen); }
    context.strokeStyle = "rgba(255, 253, 248, .9)"; context.lineWidth = 5; context.stroke();
    context.setLineDash([5, 7]); context.strokeStyle = "#9a6048"; context.lineWidth = 2.2; context.stroke(); context.setLineDash([]);
    [[basinA, "A"], [{ x: 0.05, y: -0.37 }, "‡"], [basinB, "B"]].forEach(([point, label]) => {
      const [x, y] = toScreen(point.x, point.y, width, height);
      context.beginPath(); context.arc(x, y, label === "‡" ? 8 : 10, 0, Math.PI * 2); context.fillStyle = "#fffdf8"; context.fill(); context.strokeStyle = "#17384f"; context.lineWidth = 1.4; context.stroke();
      context.fillStyle = "#17384f"; context.font = "600 11px Inter, Arial, sans-serif"; context.textAlign = "center"; context.textBaseline = "middle"; context.fillText(label, x, y + 0.5);
    });
    const [x, y] = toScreen(...Object.values(pathPoint(progress)), width, height);
    context.beginPath(); context.arc(x, y, 8, 0, Math.PI * 2); context.fillStyle = "#b8863a"; context.fill(); context.strokeStyle = "#fffdf8"; context.lineWidth = 2; context.stroke();
  }

  function draw() {
    const { width, height } = canvas.getBoundingClientRect();
    context.clearRect(0, 0, width, height); field(width, height); contours(width, height); path(width, height);
    if (hover) { const [x, y] = toScreen(hover.x, hover.y, width, height); context.beginPath(); context.arc(x, y, 13, 0, Math.PI * 2); context.strokeStyle = "rgba(255,255,255,.92)"; context.lineWidth = 1.5; context.stroke(); }
  }

  function describe(point) {
    if (Math.hypot(point.x - basinA.x, point.y - basinA.y) < .72) return "Basin A — a low free-energy metastable state.";
    if (Math.hypot(point.x - basinB.x, point.y - basinB.y) < .72) return "Basin B — a second metastable state.";
    if (Math.hypot(point.x, point.y + .32) < .72) return "Transition state — the barrier between basins.";
    return `Relative free energy: ${energy(point.x, point.y).toFixed(2)}.`;
  }

  function frame(now) {
    const elapsed = Math.min(.05, (now - lastFrame) / 1000); lastFrame = now;
    if (!paused && !document.hidden) progress = (progress + elapsed / 8) % 1;
    draw(); if (!reduceMotion) requestAnimationFrame(frame);
  }

  resize(); draw();
  if (poster) { poster.style.opacity = "0"; window.setTimeout(() => { poster.style.display = "none"; }, 300); }
  new ResizeObserver(() => { resize(); draw(); }).observe(canvas);
  if (!reduceMotion) requestAnimationFrame(frame);
  canvas.addEventListener("pointermove", (event) => { const rect = canvas.getBoundingClientRect(); const [x, y] = toWorld(event.clientX - rect.left, event.clientY - rect.top, rect.width, rect.height); hover = { x, y }; if (status) status.textContent = describe(hover); });
  canvas.addEventListener("pointerleave", () => { hover = null; if (status) status.textContent = "Move across the landscape to inspect basins and the barrier."; });
  toggle?.addEventListener("click", () => { paused = !paused; toggle.setAttribute("aria-label", paused ? "Play trajectory animation" : "Pause trajectory animation"); toggle.title = paused ? "Play trajectory animation" : "Pause trajectory animation"; toggle.querySelector(".icon-pause").style.display = paused ? "none" : "block"; toggle.querySelector(".icon-play").style.display = paused ? "block" : "none"; setLiveStatus(paused ? "Trajectory animation paused." : "Trajectory animation playing."); draw(); });
  reset?.addEventListener("click", () => { progress = 0; draw(); setLiveStatus("Trajectory reset to Basin A."); });
  document.addEventListener("visibilitychange", () => { lastFrame = performance.now(); });

  const panels = { landscape: $("#landscape-panel"), protein: $("#protein-panel") };
  const dots = Array.from(document.querySelectorAll("[data-hero-slide]"));
  let currentSlide = "landscape";
  const showSlide = (name) => {
    currentSlide = name;
    Object.entries(panels).forEach(([id, panel]) => {
      const active = id === name;
      panel?.classList.toggle("is-active", active);
      panel?.setAttribute("aria-hidden", String(!active));
    });
    dots.forEach((dot) => { const active = dot.dataset.heroSlide === name; dot.classList.toggle("is-active", active); dot.setAttribute("aria-pressed", String(active)); });
    setLiveStatus(name === "protein" ? "Showing Ubiquitin protein cartoon." : "Showing free-energy landscape.");
  };
  dots.forEach((dot) => dot.addEventListener("click", () => showSlide(dot.dataset.heroSlide)));
  $("#hero-carousel-prev")?.addEventListener("click", () => showSlide(currentSlide === "landscape" ? "protein" : "landscape"));
  $("#hero-carousel-next")?.addEventListener("click", () => showSlide(currentSlide === "landscape" ? "protein" : "landscape"));
}
