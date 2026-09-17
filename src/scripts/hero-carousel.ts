import * as THREE from 'three';
import * as $3Dmol from '3dmol';

interface SlideController {
  setActive(active: boolean): void;
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function cssVar(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function makeDotTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.7)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function observeResize(container: HTMLElement, onResize: (w: number, h: number) => void) {
  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) onResize(width, height);
    }
  });
  ro.observe(container);
  return ro;
}

/* ------------------------------------------------------------------ */
/* Slide 1: a live-rendered 3D free-energy surface with a highlighted  */
/* transition pathway and a small walker travelling along it.         */
/* ------------------------------------------------------------------ */
function initFES(container: HTMLElement, onFirstFrame: () => void): SlideController {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const accent = new THREE.Color(cssVar('--color-accent', '#1f6f6b'));
  const warm = new THREE.Color('#c9772f');
  const low = new THREE.Color('#20514f');

  const size = 10;
  const seg = 130;
  const geometry = new THREE.PlaneGeometry(size, size, seg, seg);
  geometry.rotateX(-Math.PI / 2);

  const basinA = { x: -2.3, z: -1.6 };
  const basinB = { x: 2.4, z: 1.8 };

  function heightAt(x: number, z: number): number {
    const a = Math.exp(-((x - basinA.x) ** 2 + (z - basinA.z) ** 2) / 4.6);
    const b = Math.exp(-((x - basinB.x) ** 2 + (z - basinB.z) ** 2) / 4.6);
    const ripple = 0.04 * Math.sin(x * 1.4) * Math.cos(z * 1.4);
    return -1.75 * a - 1.75 * b + ripple + 1.0;
  }

  const pos = geometry.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(pos.count * 3);
  let minH = Infinity;
  let maxH = -Infinity;
  for (let i = 0; i < pos.count; i++) {
    const h = heightAt(pos.getX(i), pos.getZ(i));
    pos.setY(i, h);
    minH = Math.min(minH, h);
    maxH = Math.max(maxH, h);
  }
  for (let i = 0; i < pos.count; i++) {
    const h = heightAt(pos.getX(i), pos.getZ(i));
    const t = (h - minH) / (maxH - minH || 1);
    const c = low.clone().lerp(accent, Math.min(t * 2, 1)).lerp(warm, Math.max(t * 2 - 1, 0));
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.6,
    metalness: 0.05,
    flatShading: false,
  });
  const surface = new THREE.Mesh(geometry, material);
  scene.add(surface);

  const wireGeo = new THREE.WireframeGeometry(new THREE.PlaneGeometry(size, size, 26, 26).rotateX(-Math.PI / 2));
  const wirePos = wireGeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < wirePos.count; i++) {
    wirePos.setY(i, heightAt(wirePos.getX(i), wirePos.getZ(i)) + 0.01);
  }
  const wireMat = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.06 });
  scene.add(new THREE.LineSegments(wireGeo, wireMat));

  const curvePoints: THREE.Vector3[] = [];
  const steps = 24;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = basinA.x + (basinB.x - basinA.x) * t;
    const z = basinA.z + (basinB.z - basinA.z) * t + Math.sin(t * Math.PI) * 1.1;
    curvePoints.push(new THREE.Vector3(x, heightAt(x, z) + 0.14, z));
  }
  const curve = new THREE.CatmullRomCurve3(curvePoints);
  const tube = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 90, 0.032, 8, false),
    new THREE.MeshBasicMaterial({ color: accent })
  );
  scene.add(tube);

  const walker = new THREE.Mesh(
    new THREE.SphereGeometry(0.075, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  scene.add(walker);

  for (const [x, z] of [
    [basinA.x, basinA.z],
    [basinB.x, basinB.z],
  ]) {
    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x1c2128 })
    );
    marker.position.set(x, heightAt(x, z) + 0.06, z);
    scene.add(marker);
  }

  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  const dir = new THREE.DirectionalLight(0xffffff, 0.9);
  dir.position.set(4, 6, 3);
  scene.add(dir);

  camera.position.set(9.25, 4.84, 5.94);
  camera.lookAt(0, -0.2, 0);

  let angle = 1.0;
  let walkT = 0;
  let active = true;
  let rafId = 0;
  let lastTime = performance.now();
  let rendered = false;

  function frame(now: number) {
    rafId = requestAnimationFrame(frame);
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    if (active && !prefersReducedMotion) {
      angle += dt * 0.1;
      const radius = 11;
      camera.position.x = Math.sin(angle) * radius;
      camera.position.z = Math.cos(angle) * radius;
      camera.position.y = 4.6 + Math.sin(angle * 0.5) * 0.5;
      camera.lookAt(0, -0.2, 0);

      walkT += dt * 0.09;
      if (walkT >= 1) walkT -= 1;
      const p = curve.getPointAt(Math.min(Math.max(walkT, 0), 0.9999));
      walker.position.copy(p);
      walker.position.y += 0.02;
    }

    renderer.render(scene, camera);
    if (!rendered) {
      rendered = true;
      onFirstFrame();
    }
  }

  observeResize(container, (w, h) => {
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });

  rafId = requestAnimationFrame(frame);

  return {
    setActive(next: boolean) {
      active = next;
      lastTime = performance.now();
    },
  };
}

/* ------------------------------------------------------------------ */
/* Slide 2: a real ligand-bound protein structure (PDB 3PTB, trypsin  */
/* with benzamidine bound) rendered with 3Dmol.js and slowly spun.    */
/* ------------------------------------------------------------------ */
function initProtein(container: HTMLElement, onFirstFrame: () => void): SlideController {
  const viewer = $3Dmol.createViewer(container, {
    backgroundAlpha: 0,
    antialias: true,
  });

  let active = true;
  let loaded = false;

  $3Dmol.download('pdb:3PTB', viewer, {}, () => {
    viewer.setStyle({ hetflag: false }, { cartoon: { color: 'spectrum', thickness: 0.9 } });
    viewer.setStyle({ hetflag: true, resn: 'BEN' }, { stick: { colorscheme: 'greenCarbon', radius: 0.18 } });
    viewer.setStyle({ resn: 'HOH' }, {});
    viewer.zoomTo();
    viewer.zoom(0.9);
    viewer.render();
    loaded = true;
    onFirstFrame();
    if (active && !prefersReducedMotion) viewer.spin('y', 0.55);
  });

  observeResize(container, () => {
    if (!loaded) return;
    viewer.resize();
  });

  return {
    setActive(next: boolean) {
      active = next;
      if (!loaded) return;
      if (next && !prefersReducedMotion) {
        viewer.spin('y', 0.55);
      } else {
        viewer.spin(false);
        viewer.render();
      }
    },
  };
}

/* ------------------------------------------------------------------ */
/* Slide 3: a learned latent-space point cloud — an IceCoder-style    */
/* embedding where structurally distinct clusters separate cleanly.   */
/* ------------------------------------------------------------------ */
function initLatent(container: HTMLElement, onFirstFrame: () => void): SlideController {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const palette = ['#1f6f6b', '#c9772f', '#4a6fa5', '#8a5fb0', '#b0554f', '#5f8f4e', '#a68a2e'];
  const random = mulberry32(7);
  const clusterCount = palette.length;
  const perCluster = 220;
  const totalPoints = clusterCount * perCluster;

  const positions = new Float32Array(totalPoints * 3);
  const colors = new Float32Array(totalPoints * 3);

  let idx = 0;
  for (let c = 0; c < clusterCount; c++) {
    const theta = (c / clusterCount) * Math.PI * 2;
    const radius = 2.5 + (c % 2) * 0.6;
    const cx = Math.cos(theta) * radius;
    const cy = (random() - 0.5) * 1.6;
    const cz = Math.sin(theta) * radius;
    const color = new THREE.Color(palette[c]);
    const spread = 0.42 + random() * 0.12;

    for (let i = 0; i < perCluster; i++) {
      const gx = (random() + random() + random() - 1.5) * spread;
      const gy = (random() + random() + random() - 1.5) * spread;
      const gz = (random() + random() + random() - 1.5) * spread;
      positions[idx * 3] = cx + gx;
      positions[idx * 3 + 1] = cy + gy;
      positions[idx * 3 + 2] = cz + gz;
      colors[idx * 3] = color.r;
      colors[idx * 3 + 1] = color.g;
      colors[idx * 3 + 2] = color.b;
      idx++;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.16,
    vertexColors: true,
    map: makeDotTexture(),
    transparent: true,
    depthWrite: false,
    opacity: 0.92,
  });

  const group = new THREE.Group();
  group.add(new THREE.Points(geometry, material));
  group.rotation.x = 0.35;
  scene.add(group);

  camera.position.set(0, 0, 8);
  camera.lookAt(0, 0, 0);

  let active = true;
  let rafId = 0;
  let lastTime = performance.now();
  let rendered = false;

  function frame(now: number) {
    rafId = requestAnimationFrame(frame);
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    if (active && !prefersReducedMotion) {
      group.rotation.y += dt * 0.18;
    }

    renderer.render(scene, camera);
    if (!rendered) {
      rendered = true;
      onFirstFrame();
    }
  }

  observeResize(container, (w, h) => {
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });

  rafId = requestAnimationFrame(frame);

  return {
    setActive(next: boolean) {
      active = next;
      lastTime = performance.now();
    },
  };
}

/* ------------------------------------------------------------------ */
/* Carousel wiring                                                     */
/* ------------------------------------------------------------------ */
const root = document.getElementById('hero-carousel');
if (root) {
  const fesStage = document.getElementById('fes3d-stage') as HTMLElement;
  const proteinStage = document.getElementById('protein3d-stage') as HTMLElement;
  const latentStage = document.getElementById('latent3d-stage') as HTMLElement;
  const loadingEl = document.getElementById('stage-loading');
  const slides = Array.from(root.querySelectorAll<HTMLElement>('.carousel-slide'));
  const dots = Array.from(root.querySelectorAll<HTMLButtonElement>('.carousel-dot'));
  const captionText = document.getElementById('carousel-caption-text');
  const captionIndex = document.getElementById('carousel-caption-index');
  const prevBtn = root.querySelector<HTMLButtonElement>('.carousel-prev');
  const nextBtn = root.querySelector<HTMLButtonElement>('.carousel-next');

  const captions = [
    'Free-energy landscape',
    'Ligand–protein unbinding · PDB 3PTB',
    'Learned latent representation',
  ];

  let readyCount = 0;
  const markReady = () => {
    readyCount += 1;
    if (readyCount >= 1 && loadingEl) loadingEl.classList.add('is-hidden');
  };

  const controllers: SlideController[] = [
    initFES(fesStage, markReady),
    initProtein(proteinStage, markReady),
    initLatent(latentStage, markReady),
  ];

  let current = 0;
  let timer: number | undefined;

  function activate(index: number) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === current);
      dot.setAttribute('aria-selected', String(i === current));
    });
    controllers.forEach((c, i) => c.setActive(i === current));
    if (captionText) captionText.textContent = captions[current];
    if (captionIndex) captionIndex.textContent = String(current + 1).padStart(2, '0');
  }

  function next() {
    activate(current + 1);
  }

  function prev() {
    activate(current - 1);
  }

  function startAutoplay() {
    if (prefersReducedMotion) return;
    stopAutoplay();
    timer = window.setInterval(next, 7000);
  }

  function stopAutoplay() {
    if (timer) window.clearInterval(timer);
  }

  nextBtn?.addEventListener('click', () => {
    next();
    startAutoplay();
  });
  prevBtn?.addEventListener('click', () => {
    prev();
    startAutoplay();
  });
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      activate(Number(dot.dataset.index));
      startAutoplay();
    });
  });

  root.addEventListener('mouseenter', stopAutoplay);
  root.addEventListener('mouseleave', startAutoplay);
  root.addEventListener('focusin', stopAutoplay);
  root.addEventListener('focusout', startAutoplay);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });

  activate(0);
  startAutoplay();
}
