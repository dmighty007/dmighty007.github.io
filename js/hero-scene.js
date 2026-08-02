/**
 * Three.js Hero Scene (Free-Energy Surface V(q) Visualization & Langevin Dynamics)
 * Enhanced high-resolution geometry (180x180 grid segments), multi-level topological iso-contours,
 * smooth satin porcelain material shading, multi-light fill, and Page Visibility API throttling.
 */

window.initHeroSceneScript = function () {
    const THREE = window.THREE;
    if (!THREE) return;

    const canvas = document.getElementById("hero-scene");
    const container = canvas?.parentElement;
    if (!canvas || !container) return;

    const TWO_PI = 2 * Math.PI;

    // Hardware quality adaptation
    const isLowPower =
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
        window.innerWidth <= 700;

    const GRID_SEGS = isLowPower ? 80 : 180;
    const GRID_SIZE = 14.0;
    const PARTICLE_COUNT = isLowPower ? 40 : 100;
    const pixelRatioCap = isLowPower ? 1.25 : 2.0;

    const BASIN_LEFT = { x: -1.4, z: -0.75 };
    const BASIN_RIGHT = { x: 1.4, z: 0.75 };

    const MOBILITY = 0.45;           // Mobility parameter (μ)
    const THERMAL_ENERGY = 0.02;     // Thermal energy (kB * T)
    const DIFFUSION = MOBILITY * THERMAL_ENERGY; // Einstein relation: D = μ * kB * T

    const TRANSIT_SPEED = 0.14;
    const BASIN_HOLD = 2.2;
    const WALKER_LIFT = 0.06;

    function gaussRandom() {
        let u, v, s;
        do {
            u = Math.random() * 2 - 1;
            v = Math.random() * 2 - 1;
            s = u * u + v * v;
        } while (s >= 1 || s === 0);
        return u * Math.sqrt((-2 * Math.log(s)) / s);
    }

    function smoothstep(e0, e1, x) {
        const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
        return t * t * (3 - 2 * t);
    }

    function fesHeight(x, z) {
        const dA2 = (x + 1.4) ** 2 + (z + 0.75) ** 2;
        const dB2 = (x - 1.4) ** 2 + (z - 0.75) ** 2;
        const dS2 = x * x * 1.4 + z * z * 1.4;

        const rawY = (
            -0.85 * Math.exp(-dA2 / 0.8) -
            0.75 * Math.exp(-dB2 / 0.9) +
            0.26 * Math.exp(-dS2) +
            0.035 * (x * x + z * z) -
            0.12
        );

        const r = Math.hypot(x, z);
        const edgeFade = smoothstep(6.5, 4.0, r);
        return rawY * edgeFade;
    }

    function fesGradient(x, z, out) {
        const dA2 = (x + 1.4) ** 2 + (z + 0.75) ** 2;
        const dB2 = (x - 1.4) ** 2 + (z - 0.75) ** 2;
        const dS2 = x * x * 1.4 + z * z * 1.4;

        const eA = Math.exp(-dA2 / 0.8);
        const eB = Math.exp(-dB2 / 0.9);
        const eS = Math.exp(-dS2);

        out.set(
            -0.85 * eA * ((-2 * (x + 1.4)) / 0.8) -
                0.75 * eB * ((-2 * (x - 1.4)) / 0.9) +
                0.26 * eS * (-2.8 * x) +
                0.07 * x,
            -0.85 * eA * ((-2 * (z + 0.75)) / 0.8) -
                0.75 * eB * ((-2 * (z - 0.75)) / 0.9) +
                0.26 * eS * (-2.8 * z) +
                0.07 * z
        );
        return out;
    }

    const COLOR_BASIN_A = new THREE.Color(0x3c7a76);
    const COLOR_BASIN_B = new THREE.Color(0x1e3552);
    const COLOR_SADDLE = new THREE.Color(0xb8863a);
    const COLOR_SURFACE = new THREE.Color(0xede6da);

    function energyColor(x, z, y, target) {
        const dA = Math.hypot(x + 1.4, z + 0.75);
        const dB = Math.hypot(x - 1.4, z - 0.75);
        const dCenter = Math.hypot(x, z);

        target.copy(COLOR_SURFACE);

        if (dA < 2.2) {
            const tA = smoothstep(2.2, 0.2, dA) * 0.78;
            target.lerp(COLOR_BASIN_A, tA);
        }
        if (dB < 2.2) {
            const tB = smoothstep(2.2, 0.2, dB) * 0.74;
            target.lerp(COLOR_BASIN_B, tB);
        }
        if (dCenter < 1.3 && y > -0.3) {
            const tS = smoothstep(1.3, 0.0, dCenter) * 0.65;
            target.lerp(COLOR_SADDLE, tS);
        }

        const r = Math.hypot(x, z);
        if (r > 3.5) {
            const tEdge = smoothstep(3.5, 6.0, r);
            target.lerp(COLOR_SURFACE, tEdge);
        }

        return target;
    }

    function computeTransitionPath() {
        const N = 100;
        const images = [];
        for (let i = 0; i <= N; i++) {
            const t = i / N;
            images.push({
                x: THREE.MathUtils.lerp(BASIN_LEFT.x, BASIN_RIGHT.x, t),
                z: THREE.MathUtils.lerp(BASIN_LEFT.z, BASIN_RIGHT.z, t) + 0.35 * Math.sin(t * Math.PI),
            });
        }

        const _g = new THREE.Vector2();
        const steps = 400;
        const stepSize = 0.002;

        for (let s = 0; s < steps; s++) {
            for (let i = 1; i < N; i++) {
                fesGradient(images[i].x, images[i].z, _g);
                images[i].x -= _g.x * stepSize;
                images[i].z -= _g.y * stepSize;
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

        return images.map(p => new THREE.Vector3(p.x, fesHeight(p.x, p.z) + 0.04, p.z));
    }

    function createIsoContours() {
        const levels = [-0.8, -0.7, -0.6, -0.5, -0.4, -0.3, -0.2, -0.1, 0.0, 0.1, 0.2, 0.3];
        const gridRes = isLowPower ? 80 : 140;
        const step = GRID_SIZE / gridRes;
        const halfGrid = GRID_SIZE / 2;

        const linePoints = [];
        const heights = new Float32Array((gridRes + 1) * (gridRes + 1));

        function getH(i, j) {
            return heights[i * (gridRes + 1) + j];
        }

        for (let i = 0; i <= gridRes; i++) {
            const x = -halfGrid + i * step;
            for (let j = 0; j <= gridRes; j++) {
                const z = -halfGrid + j * step;
                heights[i * (gridRes + 1) + j] = fesHeight(x, z);
            }
        }

        for (const lvl of levels) {
            for (let i = 0; i < gridRes; i++) {
                const x0 = -halfGrid + i * step;
                const x1 = x0 + step;
                for (let j = 0; j < gridRes; j++) {
                    const z0 = -halfGrid + j * step;
                    const z1 = z0 + step;

                    const h00 = getH(i, j);
                    const h10 = getH(i + 1, j);
                    const h01 = getH(i, j + 1);

                    if ((h00 <= lvl && h10 > lvl) || (h00 > lvl && h10 <= lvl)) {
                        const t = (lvl - h00) / (h10 - h00 || 1e-5);
                        const cx = THREE.MathUtils.lerp(x0, x1, t);
                        linePoints.push(cx, lvl + 0.008, z0);
                        linePoints.push(cx, lvl + 0.008, z0 + step * 0.4);
                    }
                    if ((h00 <= lvl && h01 > lvl) || (h00 > lvl && h01 <= lvl)) {
                        const t = (lvl - h00) / (h01 - h00 || 1e-5);
                        const cz = THREE.MathUtils.lerp(z0, z1, t);
                        linePoints.push(x0, lvl + 0.008, cz);
                        linePoints.push(x0 + step * 0.4, lvl + 0.008, cz);
                    }
                }
            }
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(linePoints, 3));

        const mat = new THREE.LineBasicMaterial({
            color: 0x5c5244,
            transparent: true,
            opacity: 0.18,
            depthWrite: false,
        });

        const segments = new THREE.LineSegments(geo, mat);
        segments.renderOrder = 1;
        return segments;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xede6da);

    const camera = new THREE.PerspectiveCamera(30, container.clientWidth / container.clientHeight, 0.1, 100);
    const initialCamPos = new THREE.Vector3(1.8, 4.4, 6.4);
    camera.position.copy(initialCamPos);
    camera.lookAt(0, -0.35, 0);

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            powerPreference: "high-performance"
        });
    } catch (e) {
        console.warn("WebGL initialization failed:", e);
        return;
    }

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioCap));
    renderer.setClearColor(0xede6da, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    if (!isLowPower) {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    const ambient = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambient);

    const hemiLight = new THREE.HemisphereLight(0xfffdfa, 0xede6da, 0.45);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffdfa, 1.15);
    dirLight.position.set(5, 12, 7);
    if (!isLowPower) {
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
    }
    scene.add(dirLight);

    const surfaceGeo = new THREE.PlaneGeometry(GRID_SIZE, GRID_SIZE, GRID_SEGS, GRID_SEGS);
    surfaceGeo.rotateX(-Math.PI / 2);

    const posAttr = surfaceGeo.attributes.position;
    const colors = new Float32Array(posAttr.count * 3);
    const _c = new THREE.Color();

    for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const z = posAttr.getZ(i);
        const y = fesHeight(x, z);
        posAttr.setY(i, y);

        energyColor(x, z, y, _c);
        _c.toArray(colors, i * 3);
    }

    surfaceGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    surfaceGeo.computeVertexNormals();

    const surfaceMat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.42,
        metalness: 0.05,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: 2,
        polygonOffsetUnits: 2
    });

    const surfaceMesh = new THREE.Mesh(surfaceGeo, surfaceMat);
    if (!isLowPower) {
        surfaceMesh.receiveShadow = true;
        surfaceMesh.castShadow = true;
    }
    scene.add(surfaceMesh);

    const isoContours = createIsoContours();
    scene.add(isoContours);

    const pathPoints = computeTransitionPath();
    const curve = new THREE.CatmullRomCurve3(pathPoints, false, "catmullrom", 0.3);

    const tubeGeo = new THREE.TubeGeometry(curve, 160, 0.016, 12, false);
    const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x9e3820,
        emissive: 0x5a180a,
        emissiveIntensity: 0.35,
        roughness: 0.6,
        metalness: 0.25,
        transparent: true,
        opacity: 0.75,
        depthWrite: false
    });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.renderOrder = 3;
    scene.add(tube);

    const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 32, 32),
        new THREE.MeshStandardMaterial({
            color: 0x9e3820,
            emissive: 0x5a180a,
            emissiveIntensity: 0.45,
            roughness: 0.7,
            metalness: 0.3
        })
    );
    if (!isLowPower) marker.castShadow = true;
    marker.renderOrder = 10;
    scene.add(marker);

    const walkers = [];
    const sphereGeoSmall = new THREE.SphereGeometry(0.038, 20, 20);
    const sphereGeoMain = new THREE.SphereGeometry(0.065, 32, 32);

    const matLeft = new THREE.MeshStandardMaterial({ color: 0x3c7a76, emissive: 0x0c302d, emissiveIntensity: 0.25, roughness: 0.85 });
    const matRight = new THREE.MeshStandardMaterial({ color: 0x1e3552, emissive: 0x081220, emissiveIntensity: 0.25, roughness: 0.85 });
    const matDeviating = new THREE.MeshStandardMaterial({ color: 0x8e5c1e, emissive: 0x4a2e0a, emissiveIntensity: 0.3, roughness: 0.85 });
    const matTransition = new THREE.MeshStandardMaterial({ color: 0x9e3820, emissive: 0x5a180a, emissiveIntensity: 0.35, roughness: 0.85 });

    for (let i = 0; i < (isLowPower ? 8 : 14); i++) {
        const mesh = new THREE.Mesh(sphereGeoSmall, matLeft);
        if (!isLowPower) { mesh.castShadow = true; mesh.receiveShadow = true; }
        const hx = BASIN_LEFT.x + (Math.random() - 0.5) * 0.6;
        const hz = BASIN_LEFT.z + (Math.random() - 0.5) * 0.6;
        mesh.position.set(hx, fesHeight(hx, hz) + WALKER_LIFT, hz);
        scene.add(mesh);
        walkers.push({ mesh, type: "basin_left", pos: new THREE.Vector2(hx, hz), home: { x: BASIN_LEFT.x, z: BASIN_LEFT.z }, confinementRadius: 0.6 });
    }

    for (let i = 0; i < (isLowPower ? 8 : 14); i++) {
        const mesh = new THREE.Mesh(sphereGeoSmall, matRight);
        if (!isLowPower) { mesh.castShadow = true; mesh.receiveShadow = true; }
        const hx = BASIN_RIGHT.x + (Math.random() - 0.5) * 0.6;
        const hz = BASIN_RIGHT.z + (Math.random() - 0.5) * 0.6;
        mesh.position.set(hx, fesHeight(hx, hz) + WALKER_LIFT, hz);
        scene.add(mesh);
        walkers.push({ mesh, type: "basin_right", pos: new THREE.Vector2(hx, hz), home: { x: BASIN_RIGHT.x, z: BASIN_RIGHT.z }, confinementRadius: 0.6 });
    }

    for (let i = 0; i < (isLowPower ? 2 : 4); i++) {
        const mesh = new THREE.Mesh(sphereGeoSmall, matDeviating);
        if (!isLowPower) { mesh.castShadow = true; mesh.receiveShadow = true; }
        const angle = Math.random() * TWO_PI;
        const r = Math.random() * 1.5;
        const hx = Math.cos(angle) * r * 0.6;
        const hz = Math.sin(angle) * r * 0.6;
        mesh.position.set(hx, fesHeight(hx, hz) + WALKER_LIFT, hz);
        scene.add(mesh);
        walkers.push({ mesh, type: "deviating", pos: new THREE.Vector2(hx, hz), mobilityMultiplier: 1.2, diffusionMultiplier: 1.4 });
    }

    const transMesh = new THREE.Mesh(sphereGeoMain, matTransition);
    if (!isLowPower) { transMesh.castShadow = true; transMesh.receiveShadow = true; }
    scene.add(transMesh);
    walkers.push({ mesh: transMesh, type: "transition", pos: new THREE.Vector2(BASIN_LEFT.x, BASIN_LEFT.z), phaseOffset: 0 });

    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const px = (Math.random() - 0.5) * 8.5;
        const pz = (Math.random() - 0.5) * 8.5;
        particlePos[i * 3] = px;
        particlePos[i * 3 + 1] = fesHeight(px, pz) + 0.15 + Math.random() * 0.6;
        particlePos[i * 3 + 2] = pz;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0x3c7a76, size: 0.025, transparent: true, opacity: 0.35, depthWrite: false });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    const mouseTarget = new THREE.Vector2(0, 0);
    const cameraTargetPos = initialCamPos.clone();

    function onPointerMove(e) {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        mouseTarget.set(x * 0.35, y * 0.25);
    }

    function onPointerLeave() {
        mouseTarget.set(0, 0);
    }

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerleave", onPointerLeave);

    renderer.render(scene, camera);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let isPaused = reduceMotion;

    const toggleBtn = document.getElementById("hero-toggle-anim");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            isPaused = !isPaused;
            toggleBtn.setAttribute("aria-label", isPaused ? "Play animation" : "Pause animation");
            toggleBtn.querySelector(".icon-pause").style.display = isPaused ? "none" : "block";
            toggleBtn.querySelector(".icon-play").style.display = isPaused ? "block" : "none";
        });
    }

    const resetBtn = document.getElementById("hero-reset-anim");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            camera.position.copy(initialCamPos);
            camera.lookAt(0, -0.35, 0);
            mouseTarget.set(0, 0);
            renderer.render(scene, camera);
        });
    }

    let isTabHidden = document.hidden;
    document.addEventListener("visibilitychange", () => {
        isTabHidden = document.hidden;
        if (!isTabHidden) {
            prevTime = performance.now();
        }
    });

    const _grad = new THREE.Vector2();
    let rafId = null;
    let prevTime = performance.now();

    function tick(now) {
        if (isTabHidden) {
            rafId = requestAnimationFrame(tick);
            return;
        }

        const delta = Math.min((now - prevTime) / 1000, 0.05);
        prevTime = now;
        const t = now * 0.001;

        if (!isPaused) {
            cameraTargetPos.x = initialCamPos.x + mouseTarget.x;
            cameraTargetPos.y = initialCamPos.y + mouseTarget.y;
            camera.position.lerp(cameraTargetPos, 0.05);
            camera.lookAt(0, -0.35, 0);

            particleMat.opacity = 0.3 + Math.sin(t * 1.2) * 0.1;

            const period = 2 + BASIN_HOLD * 2;
            const mainPhase = (t * TRANSIT_SPEED) % period;
            let mainCurveT;
            if (mainPhase < 1) mainCurveT = mainPhase;
            else if (mainPhase < 1 + BASIN_HOLD) mainCurveT = 1;
            else if (mainPhase < 2 + BASIN_HOLD) mainCurveT = 1 - (mainPhase - 1 - BASIN_HOLD);
            else mainCurveT = 0;

            const mainPathPos = curve.getPointAt(mainCurveT);
            transMesh.position.copy(mainPathPos);
            transMesh.position.y += WALKER_LIFT;
            transMesh.scale.setScalar(1.0 + Math.sin(t * 2.5) * 0.06);

            marker.position.copy(mainPathPos);
            marker.position.y += WALKER_LIFT + 0.015;
            marker.scale.setScalar(1.0 + Math.sin(t * 2.5 - 0.5) * 0.1);

            for (let i = 0; i < walkers.length; i++) {
                const w = walkers[i];
                if (w.type === "transition") continue;

                fesGradient(w.pos.x, w.pos.y, _grad);

                let mob = MOBILITY;
                let diff = DIFFUSION;
                if (w.type === "deviating") {
                    mob *= w.mobilityMultiplier;
                    diff *= w.diffusionMultiplier;
                }

                const driftX = -mob * _grad.x;
                const driftZ = -mob * _grad.y;
                const noiseScale = Math.sqrt(2 * diff * delta);

                w.pos.x += driftX * delta + noiseScale * gaussRandom();
                w.pos.y += driftZ * delta + noiseScale * gaussRandom();

                if (w.type === "basin_left" || w.type === "basin_right") {
                    const dh = Math.hypot(w.pos.x - w.home.x, w.pos.y - w.home.z);
                    if (dh > w.confinementRadius) {
                        const pull = Math.min((dh - w.confinementRadius) * 0.7, 0.1);
                        w.pos.x = THREE.MathUtils.lerp(w.pos.x, w.home.x, pull);
                        w.pos.y = THREE.MathUtils.lerp(w.pos.y, w.home.z, pull);
                    }
                } else if (w.type === "deviating") {
                    const distFromCenter = Math.hypot(w.pos.x, w.pos.y);
                    if (distFromCenter > 3.2) {
                        w.pos.x *= 0.98;
                        w.pos.y *= 0.98;
                    }
                }

                w.mesh.position.set(w.pos.x, fesHeight(w.pos.x, w.pos.y) + WALKER_LIFT, w.pos.y);
            }
        }

        renderer.render(scene, camera);
        rafId = requestAnimationFrame(tick);
    }

    if (!reduceMotion) {
        rafId = requestAnimationFrame(tick);
    }

    const ro = new ResizeObserver(() => {
        if (!container.clientWidth || !container.clientHeight) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.render(scene, camera);
    });
    ro.observe(container);
};
