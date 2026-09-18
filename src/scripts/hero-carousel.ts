import * as THREE from 'three';
import * as $3Dmol from '3dmol';

interface SlideController {
  setActive(active: boolean): void;
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
/* Slide 1: a live-rendered 3D free-energy surface — analytical         */
/* two-basin potential, string-method minimum-energy path, topographic  */
/* iso-contours, and a small Langevin-dynamics walker population.       */
/* Ported from the author's original hero-scene visualization.          */
/* ------------------------------------------------------------------ */
function initFES(container: HTMLElement, onFirstFrame: () => void): SlideController {
  const isLowPower = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || window.innerWidth <= 700;
  const GRID_SEGS = isLowPower ? 80 : 150;
  const GRID_SIZE = 8.4;
  const CONTOUR_RES = isLowPower ? 60 : 110;

  const BASIN_LEFT = { x: -1.4, z: -0.75 };
  const BASIN_RIGHT = { x: 1.4, z: 0.75 };
  const MOBILITY = 0.45;
  const THERMAL_ENERGY = 0.02;
  const DIFFUSION = MOBILITY * THERMAL_ENERGY;
  const WALKER_LIFT = 0.045;

  function gaussRandom(): number {
    let u = 0;
    let v = 0;
    let s = 0;
    do {
      u = Math.random() * 2 - 1;
      v = Math.random() * 2 - 1;
      s = u * u + v * v;
    } while (s >= 1 || s === 0);
    return u * Math.sqrt((-2 * Math.log(s)) / s);
  }

  function smoothstep(e0: number, e1: number, x: number): number {
    const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
  }

  function fesHeight(x: number, z: number): number {
    const dA2 = (x + 1.4) ** 2 + (z + 0.75) ** 2;
    const dB2 = (x - 1.4) ** 2 + (z - 0.75) ** 2;
    const dS2 = x * x * 1.4 + z * z * 1.4;
    const texture = 0.012 * Math.sin(1.7 * x + 0.45 * z) * Math.cos(1.25 * z - 0.25 * x);
    const rawY =
      -0.85 * Math.exp(-dA2 / 0.8) - 0.75 * Math.exp(-dB2 / 0.9) + 0.26 * Math.exp(-dS2) + 0.035 * (x * x + z * z) - 0.12 + texture;
    const edgeFade = smoothstep(4.18, 3.1, Math.hypot(x, z));
    return rawY * edgeFade;
  }

  function fesGradient(x: number, z: number, out: THREE.Vector2): THREE.Vector2 {
    const dA2 = (x + 1.4) ** 2 + (z + 0.75) ** 2;
    const dB2 = (x - 1.4) ** 2 + (z - 0.75) ** 2;
    const dS2 = x * x * 1.4 + z * z * 1.4;
    const eA = Math.exp(-dA2 / 0.8);
    const eB = Math.exp(-dB2 / 0.9);
    const eS = Math.exp(-dS2);
    const textureX =
      0.012 * (1.7 * Math.cos(1.7 * x + 0.45 * z) * Math.cos(1.25 * z - 0.25 * x) - 0.25 * Math.sin(1.7 * x + 0.45 * z) * Math.sin(1.25 * z - 0.25 * x));
    const textureZ =
      0.012 * (0.45 * Math.cos(1.7 * x + 0.45 * z) * Math.cos(1.25 * z - 0.25 * x) - 1.25 * Math.sin(1.7 * x + 0.45 * z) * Math.sin(1.25 * z - 0.25 * x));
    out.set(
      -0.85 * eA * ((-2 * (x + 1.4)) / 0.8) - 0.75 * eB * ((-2 * (x - 1.4)) / 0.9) + 0.26 * eS * (-2.8 * x) + 0.07 * x + textureX,
      -0.85 * eA * ((-2 * (z + 0.75)) / 0.8) - 0.75 * eB * ((-2 * (z - 0.75)) / 0.9) + 0.26 * eS * (-2.8 * z) + 0.07 * z + textureZ
    );
    return out;
  }

  // A restrained teal-to-cream gradient matching the site's own palette
  // (--color-accent-strong / --color-accent / --color-bg) rather than an
  // unrelated blue-to-gold scheme, so the visualization reads as part of
  // the page rather than a separate, more saturated graphic.
  // Coolwarm-style diverging colormap: cool blue-teal basins warming to a
  // sandy neutral on the highlands, fading to the page background at the
  // rim.
  const COLOR_LOW = new THREE.Color(0x3d5f68);
  const COLOR_MID = new THREE.Color(0x8fb4bb);
  const COLOR_HIGH = new THREE.Color(0xd9cdad);
  const COLOR_EDGE = new THREE.Color(0xfaf8f4);

  function energyColor(x: number, z: number, y: number, target: THREE.Color): THREE.Color {
    const height = smoothstep(-0.88, 0.22, y);
    if (height < 0.52) target.copy(COLOR_LOW).lerp(COLOR_MID, height / 0.52);
    else target.copy(COLOR_MID).lerp(COLOR_HIGH, (height - 0.52) / 0.48);
    const edge = smoothstep(3.1, 4.15, Math.hypot(x, z));
    target.lerp(COLOR_EDGE, edge * 0.85);
    return target;
  }

  function computeTransitionPath(): THREE.Vector3[] {
    const N = 70;
    const images: { x: number; z: number }[] = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      images.push({
        x: THREE.MathUtils.lerp(BASIN_LEFT.x, BASIN_RIGHT.x, t),
        z: THREE.MathUtils.lerp(BASIN_LEFT.z, BASIN_RIGHT.z, t) + 0.35 * Math.sin(t * Math.PI),
      });
    }
    const g = new THREE.Vector2();
    const steps = 260;
    const stepSize = 0.002;
    for (let s = 0; s < steps; s++) {
      for (let i = 1; i < N; i++) {
        fesGradient(images[i].x, images[i].z, g);
        images[i].x -= g.x * stepSize;
        images[i].z -= g.y * stepSize;
      }
      for (let i = 1; i < N; i++) {
        const prev = images[i - 1];
        const next = images[i + 1];
        const mx = (prev.x + next.x) / 2;
        const mz = (prev.z + next.z) / 2;
        const dx = images[i].x - mx;
        const dz = images[i].z - mz;
        const len = Math.hypot(dx, dz) || 1;
        const targetDist = Math.hypot(next.x - prev.x, next.z - prev.z) / 2;
        images[i].x = mx + (dx / len) * targetDist;
        images[i].z = mz + (dz / len) * targetDist;
      }
    }
    return images.map((p) => new THREE.Vector3(p.x, fesHeight(p.x, p.z) + 0.035, p.z));
  }

  function createIsoContours(): THREE.LineSegments {
    const levels = [-0.8, -0.65, -0.5, -0.35, -0.2, -0.05, 0.1, 0.25];
    const step = GRID_SIZE / CONTOUR_RES;
    const half = GRID_SIZE / 2;
    const heights = new Float32Array((CONTOUR_RES + 1) * (CONTOUR_RES + 1));
    const getH = (i: number, j: number) => heights[i * (CONTOUR_RES + 1) + j];

    for (let i = 0; i <= CONTOUR_RES; i++) {
      const x = -half + i * step;
      for (let j = 0; j <= CONTOUR_RES; j++) {
        heights[i * (CONTOUR_RES + 1) + j] = fesHeight(x, -half + j * step);
      }
    }

    const linePoints: number[] = [];
    for (const lvl of levels) {
      for (let i = 0; i < CONTOUR_RES; i++) {
        const x0 = -half + i * step;
        const x1 = x0 + step;
        for (let j = 0; j < CONTOUR_RES; j++) {
          const z0 = -half + j * step;
          const z1 = z0 + step;
          const h00 = getH(i, j);
          const h10 = getH(i + 1, j);
          const h01 = getH(i, j + 1);
          if ((h00 <= lvl && h10 > lvl) || (h00 > lvl && h10 <= lvl)) {
            const t = (lvl - h00) / (h10 - h00 || 1e-5);
            const cx = THREE.MathUtils.lerp(x0, x1, t);
            linePoints.push(cx, lvl + 0.006, z0, cx, lvl + 0.006, z0 + step * 0.4);
          }
          if ((h00 <= lvl && h01 > lvl) || (h00 > lvl && h01 <= lvl)) {
            const t = (lvl - h00) / (h01 - h00 || 1e-5);
            const cz = THREE.MathUtils.lerp(z0, z1, t);
            linePoints.push(x0, lvl + 0.006, cz, x0 + step * 0.4, lvl + 0.006, cz);
          }
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3));
    const mat = new THREE.LineBasicMaterial({ color: 0x5c5244, transparent: true, opacity: 0.16, depthWrite: false });
    const segments = new THREE.LineSegments(geo, mat);
    segments.renderOrder = 1;
    return segments;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowPower ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  if (!isLowPower) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
  }
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xfff6ea, 0.85));
  scene.add(new THREE.HemisphereLight(0xfff8ef, 0xcfe4e0, 0.5));
  const dirLight = new THREE.DirectionalLight(0xfff3e2, 1.0);
  dirLight.position.set(3, 7.2, 4.2);
  if (!isLowPower) {
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.left = -GRID_SIZE / 2;
    dirLight.shadow.camera.right = GRID_SIZE / 2;
    dirLight.shadow.camera.top = GRID_SIZE / 2;
    dirLight.shadow.camera.bottom = -GRID_SIZE / 2;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 20;
    dirLight.shadow.bias = -0.0025;
  }
  scene.add(dirLight);

  const surfaceGeo = new THREE.PlaneGeometry(GRID_SIZE, GRID_SIZE, GRID_SEGS, GRID_SEGS);
  surfaceGeo.rotateX(-Math.PI / 2);
  const posAttr = surfaceGeo.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(posAttr.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);
    const y = fesHeight(x, z);
    posAttr.setY(i, y);
    energyColor(x, z, y, c);
    c.toArray(colors, i * 3);
  }
  surfaceGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  surfaceGeo.computeVertexNormals();

  const surfaceMesh = new THREE.Mesh(
    surfaceGeo,
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.68, metalness: 0.01, side: THREE.DoubleSide })
  );
  if (!isLowPower) {
    surfaceMesh.receiveShadow = true;
    surfaceMesh.castShadow = true;
  }
  scene.add(surfaceMesh);
  scene.add(createIsoContours());

  const pathPoints = computeTransitionPath();
  const curve = new THREE.CatmullRomCurve3(pathPoints, false, 'centripetal', 0.5);
  const tube = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 160, 0.02, 10, false),
    new THREE.MeshStandardMaterial({
      color: 0x9e3820,
      emissive: 0x5a180a,
      emissiveIntensity: 0.35,
      roughness: 0.6,
      metalness: 0.25,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
    })
  );
  tube.renderOrder = 3;
  scene.add(tube);

  const marker = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 24, 24),
    new THREE.MeshStandardMaterial({ color: 0x9e3820, emissive: 0x5a180a, emissiveIntensity: 0.45, roughness: 0.7, metalness: 0.3 })
  );
  marker.renderOrder = 10;
  if (!isLowPower) marker.castShadow = true;
  scene.add(marker);

  type Walker = {
    mesh: THREE.Mesh;
    pos: THREE.Vector2;
    home: { x: number; z: number };
    destination?: { x: number; z: number };
    confinementRadius?: number;
    state?: 'basin' | 'crossing';
    progress?: number;
    direction?: number;
    cooldown?: number;
    phase?: number;
    basinMaterial?: THREE.Material;
    crossingMaterial?: THREE.Material;
    crossing?: boolean;
  };

  const walkers: Walker[] = [];
  const smallSphere = new THREE.SphereGeometry(0.034, 18, 18);
  const matLeft = new THREE.MeshStandardMaterial({ color: 0x3c7a76, emissive: 0x0c302d, emissiveIntensity: 0.25, roughness: 0.85 });
  const matRight = new THREE.MeshStandardMaterial({ color: 0x1e3552, emissive: 0x081220, emissiveIntensity: 0.25, roughness: 0.85 });
  const matCrossingLeft = new THREE.MeshStandardMaterial({ color: 0xe0a348, emissive: 0x5a3510, emissiveIntensity: 0.16, roughness: 0.72 });
  const matCrossingRight = new THREE.MeshStandardMaterial({ color: 0xc66f58, emissive: 0x4a1c19, emissiveIntensity: 0.16, roughness: 0.72 });

  const swarmCount = isLowPower ? 6 : 10;
  for (const [home, mat] of [
    [BASIN_LEFT, matLeft],
    [BASIN_RIGHT, matRight],
  ] as const) {
    for (let i = 0; i < swarmCount; i++) {
      const mesh = new THREE.Mesh(smallSphere, mat);
      if (!isLowPower) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
      const hx = home.x + (Math.random() - 0.5) * 0.55;
      const hz = home.z + (Math.random() - 0.5) * 0.55;
      mesh.position.set(hx, fesHeight(hx, hz) + WALKER_LIFT, hz);
      scene.add(mesh);
      walkers.push({ mesh, pos: new THREE.Vector2(hx, hz), home, confinementRadius: 0.55 });
    }
  }

  const crossingCount = isLowPower ? 2 : 5;
  for (let i = 0; i < crossingCount; i++) {
    const fromLeft = i % 2 === 0;
    const home = fromLeft ? BASIN_LEFT : BASIN_RIGHT;
    const destination = fromLeft ? BASIN_RIGHT : BASIN_LEFT;
    const basinMaterial = fromLeft ? matLeft : matRight;
    const crossingMaterial = fromLeft ? matCrossingLeft : matCrossingRight;
    const mesh = new THREE.Mesh(smallSphere, basinMaterial);
    if (!isLowPower) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
    const hx = home.x + (Math.random() - 0.5) * 0.4;
    const hz = home.z + (Math.random() - 0.5) * 0.4;
    mesh.position.set(hx, fesHeight(hx, hz) + WALKER_LIFT, hz);
    scene.add(mesh);
    walkers.push({
      mesh,
      pos: new THREE.Vector2(hx, hz),
      home,
      destination,
      direction: fromLeft ? 1 : -1,
      state: 'basin',
      progress: fromLeft ? 0 : 1,
      cooldown: Math.random() * 2.2,
      phase: Math.random() * Math.PI * 2,
      basinMaterial,
      crossingMaterial,
      crossing: true,
    });
  }

  // A single fixed viewpoint (tuned so the basin-to-basin diagonal fills
  // the square frame corner-to-corner, matching the reference framing)
  // rather than a continuous orbit — only a small pointer-driven parallax
  // is layered on top.
  const CAM_RADIUS = 5.2;
  const CAM_HEIGHT = 2.5;
  const FIXED_ANGLE = 0.12;
  const lookTarget = new THREE.Vector3(0, -0.25, 0);
  const desiredCamPos = new THREE.Vector3();
  camera.position.set(Math.sin(FIXED_ANGLE) * CAM_RADIUS, CAM_HEIGHT, Math.cos(FIXED_ANGLE) * CAM_RADIUS);
  camera.lookAt(lookTarget);

  const mouseTarget = new THREE.Vector2(0, 0);

  function onPointerMove(e: PointerEvent) {
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    mouseTarget.set(x * 0.25, y * 0.6);
  }
  function onPointerLeave() {
    mouseTarget.set(0, 0);
  }
  container.addEventListener('pointermove', onPointerMove);
  container.addEventListener('pointerleave', onPointerLeave);

  let active = true;
  let rafId = 0;
  let lastTime = performance.now();
  let rendered = false;
  const grad = new THREE.Vector2();

  function frame(now: number) {
    rafId = requestAnimationFrame(frame);
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    const t = now * 0.001;

    if (active && !prefersReducedMotion) {
      const angle = FIXED_ANGLE + mouseTarget.x;
      desiredCamPos.set(Math.sin(angle) * CAM_RADIUS, CAM_HEIGHT + mouseTarget.y, Math.cos(angle) * CAM_RADIUS);
      camera.position.lerp(desiredCamPos, 0.05);
      camera.lookAt(lookTarget);

      const period = 2 + 2.2 * 2;
      const mainPhase = (t * 0.14) % period;
      let mainT: number;
      if (mainPhase < 1) mainT = mainPhase;
      else if (mainPhase < 1 + 2.2) mainT = 1;
      else if (mainPhase < 2 + 2.2) mainT = 1 - (mainPhase - 1 - 2.2);
      else mainT = 0;
      const mainPos = curve.getPointAt(THREE.MathUtils.clamp(mainT, 0, 0.9999));
      marker.position.copy(mainPos);
      marker.position.y += WALKER_LIFT + 0.012;
      marker.scale.setScalar(1 + Math.sin(t * 2.5 - 0.5) * 0.1);

      for (const w of walkers) {
        if (w.crossing) {
          w.cooldown = (w.cooldown ?? 0) - dt;
          if (w.state === 'basin') {
            w.mesh.material = (w.cooldown ?? 0) < 0 ? w.crossingMaterial! : w.basinMaterial!;
            fesGradient(w.pos.x, w.pos.y, grad);
            const noiseScale = Math.sqrt(2 * DIFFUSION * dt) * 1.5;
            w.pos.x += -MOBILITY * grad.x * dt + noiseScale * gaussRandom();
            w.pos.y += -MOBILITY * grad.y * dt + noiseScale * gaussRandom();
            const dist = Math.hypot(w.pos.x - w.home.x, w.pos.y - w.home.z);
            if (dist > 0.55) {
              w.pos.x = THREE.MathUtils.lerp(w.pos.x, w.home.x, 0.08);
              w.pos.y = THREE.MathUtils.lerp(w.pos.y, w.home.z, 0.08);
            }
            if ((w.cooldown ?? 0) <= 0 && Math.random() < dt * 0.22) {
              w.state = 'crossing';
              w.progress = w.direction === 1 ? 0 : 1;
            }
          } else {
            w.mesh.material = w.crossingMaterial!;
            const speed = 0.12 + Math.sin(t * 0.7 + (w.phase ?? 0)) * 0.018;
            w.progress = (w.progress ?? 0) + (w.direction ?? 1) * speed * dt;
            const p = curve.getPointAt(THREE.MathUtils.clamp(w.progress ?? 0, 0, 1));
            const drift = Math.sin(t * 1.8 + (w.phase ?? 0)) * 0.04;
            w.pos.x = p.x + drift;
            w.pos.y = p.z + drift * 0.7;
            const arrived = w.direction === 1 ? (w.progress ?? 0) >= 1 : (w.progress ?? 0) <= 0;
            if (arrived) {
              const prevHome = w.home;
              w.home = { ...w.destination! };
              w.destination = { ...prevHome };
              w.direction = (w.direction ?? 1) * -1;
              w.state = 'basin';
              w.cooldown = 2 + Math.random() * 2.2;
              w.pos.set(w.home.x, w.home.z);
            }
          }
          w.mesh.position.set(w.pos.x, fesHeight(w.pos.x, w.pos.y) + WALKER_LIFT, w.pos.y);
          w.mesh.scale.setScalar(w.state === 'crossing' ? 1.15 : 0.85);
          continue;
        }

        fesGradient(w.pos.x, w.pos.y, grad);
        const noiseScale = Math.sqrt(2 * DIFFUSION * dt);
        w.pos.x += -MOBILITY * grad.x * dt + noiseScale * gaussRandom();
        w.pos.y += -MOBILITY * grad.y * dt + noiseScale * gaussRandom();
        const dh = Math.hypot(w.pos.x - w.home.x, w.pos.y - w.home.z);
        if (dh > (w.confinementRadius ?? 0.55)) {
          const pull = Math.min((dh - (w.confinementRadius ?? 0.55)) * 0.7, 0.1);
          w.pos.x = THREE.MathUtils.lerp(w.pos.x, w.home.x, pull);
          w.pos.y = THREE.MathUtils.lerp(w.pos.y, w.home.z, pull);
        }
        w.mesh.position.set(w.pos.x, fesHeight(w.pos.x, w.pos.y) + WALKER_LIFT, w.pos.y);
      }
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

  // Fetched from same-origin public/models/3ptb.pdb rather than 3Dmol's
  // remote RCSB download helper, which has no timeout and can hang
  // indefinitely for a visitor if models.rcsb.org is slow or unreachable.
  fetch('/models/3ptb.pdb')
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to fetch PDB: ${res.status}`);
      return res.text();
    })
    .then((pdbData) => {
      viewer.addModel(pdbData, 'pdb');
      viewer.setStyle({ hetflag: false }, { cartoon: { color: 'spectrum', thickness: 0.9 } });
      viewer.setStyle({ hetflag: true, resn: 'BEN' }, { stick: { colorscheme: 'greenCarbon', radius: 0.18 } });
      viewer.setStyle({ resn: 'HOH' }, {});
      viewer.zoomTo();
      viewer.zoom(0.9);
      viewer.render();
      loaded = true;
      onFirstFrame();
      if (active && !prefersReducedMotion) viewer.spin('y', 0.55);
    })
    .catch((err) => {
      console.warn('Could not load protein structure:', err);
      onFirstFrame();
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
/* Carousel wiring                                                     */
/* ------------------------------------------------------------------ */
const root = document.getElementById('hero-carousel');
if (root) {
  const fesStage = document.getElementById('fes3d-stage') as HTMLElement;
  const proteinStage = document.getElementById('protein3d-stage') as HTMLElement;
  const loadingEl = document.getElementById('stage-loading');
  const slides = Array.from(root.querySelectorAll<HTMLElement>('.carousel-slide'));
  const dots = Array.from(root.querySelectorAll<HTMLButtonElement>('.carousel-dot'));
  const captionText = document.getElementById('carousel-caption-text');
  const captionIndex = document.getElementById('carousel-caption-index');
  const prevBtn = root.querySelector<HTMLButtonElement>('.carousel-prev');
  const nextBtn = root.querySelector<HTMLButtonElement>('.carousel-next');

  const captions = ['Free-energy landscape', 'Ligand–protein unbinding · PDB 3PTB'];

  let readyCount = 0;
  const markReady = () => {
    readyCount += 1;
    if (readyCount >= 1 && loadingEl) loadingEl.classList.add('is-hidden');
  };

  const controllers: SlideController[] = [
    initFES(fesStage, markReady),
    initProtein(proteinStage, markReady),
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
