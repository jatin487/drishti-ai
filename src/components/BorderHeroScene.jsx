/**
 * BorderHeroScene.jsx
 * ─────────────────────────────────────────────────────────────────────
 * Self-contained 3D hero scene for DRISHTI-X — Intelligent Visual
 * Surveillance & Threat Analytics
 *
 * Uses React Three Fiber + @react-three/drei.
 *
 * Theme: Dark Tactical
 *   Background : #0A0F16
 *   Amber       : #E8A33D
 *   Steel-blue  : #4C6B8A
 *   Olive       : #6B7A55
 *
 * Canvas is absolutely positioned with pointer-events:none so it never
 * blocks clicks on the hero section content above it.
 * ─────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// ─── Colour palette (Light Tactical Daylight System) ──────────────────
const C = {
  amber:     "#C2790C",
  steelBlue: "#7C8E6B",
  olive:     "#5A6B47",
  sandBase:  "#EAE6DC",
};

// ─── Utility ───────────────────────────────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * t;

// ══════════════════════════════════════════════════════════════════════
//  TERRAIN — low-poly undulating plane with light wireframe overlay
// ══════════════════════════════════════════════════════════════════════
function Terrain() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(22, 22, 40, 40);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y =
        Math.sin(x * 0.42) * 0.28 +
        Math.cos(z * 0.5)  * 0.22 +
        Math.sin((x + z) * 0.25) * 0.15;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group position={[0, -3.2, 0]}>
      {/* Solid base — light warm sand */}
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial
          color={C.sandBase}
          roughness={0.95}
          metalness={0.05}
          transparent
          opacity={0.55}
        />
      </mesh>

      {/* Wireframe overlay in low-opacity tactical olive */}
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color={C.steelBlue}
          wireframe
          transparent
          opacity={0.16}
        />
      </mesh>
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  BORDER OUTPOST PIN — amber glow marker with vertical beam
// ══════════════════════════════════════════════════════════════════════
function OutpostPin({ position }) {
  const beamRef  = useRef();
  const glowRef  = useRef();
  const lightRef = useRef();
  // Each pin gets a unique phase so they pulse out-of-sync
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    const t     = clock.getElapsedTime();
    const pulse = 0.55 + 0.45 * Math.sin(t * 1.8 + phase);
    if (beamRef.current)  beamRef.current.material.opacity  = pulse * 0.55;
    if (glowRef.current)  glowRef.current.material.opacity  = pulse * 0.9;
    if (lightRef.current) lightRef.current.intensity        = pulse * 1.2;
  });

  return (
    <group position={position}>
      {/* Pulsing amber point light */}
      <pointLight
        ref={lightRef}
        color={C.amber}
        intensity={1.2}
        distance={4}
        decay={2}
      />

      {/* Vertical light beam (additive blending) */}
      <mesh ref={beamRef} position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 2.0, 6]} />
        <meshBasicMaterial
          color={C.amber}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Soft glow sphere around pin head */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshBasicMaterial
          color={C.amber}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Solid pin core */}
      <mesh>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshStandardMaterial
          color="#fff8e7"
          emissive={C.amber}
          emissiveIntensity={1.5}
        />
      </mesh>
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  SENSOR CAMERA — built from primitives, bobs & slowly orbits Y axis
// ══════════════════════════════════════════════════════════════════════
function SensorCamera() {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y  = t * 0.22;
      groupRef.current.position.y  = 1.2 + Math.sin(t * 0.6) * 0.12;
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.2, 0]}>
      {/* Mounting cone bracket (pointing down) */}
      <mesh position={[0, -0.55, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.08, 0.45, 8]} />
        <meshStandardMaterial color={C.steelBlue} roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Camera body — horizontal cylinder */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.7, 16]} />
        <meshStandardMaterial color="#1e2f40" roughness={0.25} metalness={0.85} />
      </mesh>

      {/* Lens front flat cap */}
      <mesh position={[0.36, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.04, 16]} />
        <meshStandardMaterial color="#111820" roughness={0.1} metalness={1.0} />
      </mesh>

      {/* Lens sphere with emissive amber core */}
      <mesh position={[0.42, 0, 0]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial
          color="#0a1520"
          emissive={C.amber}
          emissiveIntensity={0.9}
          roughness={0.05}
          metalness={0.3}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Inner amber lens glow (additive) */}
      <mesh position={[0.46, 0, 0]}>
        <sphereGeometry args={[0.055, 10, 10]} />
        <meshBasicMaterial
          color={C.amber}
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Amber key light emanating from the lens */}
      <pointLight
        color={C.amber}
        intensity={2.5}
        distance={6}
        decay={2}
        position={[0.5, 0, 0]}
      />

      {/* Top rail detail */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.62, 6]} />
        <meshStandardMaterial color={C.olive} roughness={0.5} metalness={0.6} />
      </mesh>
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  RADAR DOME — translucent torus rings + sphere shell (additive)
// ══════════════════════════════════════════════════════════════════════
function RadarDome() {
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  useFrame(({ clock }) => {
    const t     = clock.getElapsedTime();
    const pulse = 0.08 + 0.04 * Math.sin(t * 1.2);

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x  = t * 0.18;
      ring1Ref.current.rotation.z  = t * 0.09;
      ring1Ref.current.material.opacity = pulse + 0.04;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x  = -t * 0.12;
      ring2Ref.current.rotation.y  =  t * 0.14;
      ring2Ref.current.material.opacity = pulse * 0.7;
    }
  });

  return (
    <group position={[0, 1.2, 0]}>
      {/* Primary steel-blue torus */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.05, 0.022, 8, 80]} />
        <meshBasicMaterial
          color={C.steelBlue}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Secondary amber torus at different tilt */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.05, 0.014, 8, 80]} />
        <meshBasicMaterial
          color={C.amber}
          transparent
          opacity={0.07}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer detection sphere shell (BackSide, very faint) */}
      <mesh>
        <sphereGeometry args={[1.12, 16, 16]} />
        <meshBasicMaterial
          color={C.steelBlue}
          transparent
          opacity={0.03}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  VIDEO TEXTURE HOOK — creates a looping <video> element and wraps it
//  in a THREE.VideoTexture, keeping needsUpdate:true each frame.
// ══════════════════════════════════════════════════════════════════════
function useVideoTexture(url) {
  const [texture, setTexture] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = document.createElement("video");
    video.src         = url;
    video.loop        = true;
    video.muted       = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.autoplay    = true;
    video.preload     = "auto";
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("loop", "");

    // Attach invisibly to DOM so Chromium keeps decoding active
    video.style.position     = "fixed";
    video.style.top          = "-9999px";
    video.style.left         = "-9999px";
    video.style.width        = "16px";
    video.style.height       = "16px";
    video.style.opacity      = "0";
    video.style.pointerEvents = "none";
    document.body.appendChild(video);

    const tex = new THREE.VideoTexture(video);
    tex.minFilter       = THREE.LinearFilter;
    tex.magFilter       = THREE.LinearFilter;
    tex.format          = THREE.RGBAFormat;
    tex.generateMipmaps = false;

    const playVideo = () => {
      const p = video.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {});
      }
    };

    const handleReady = () => {
      setIsReady(true);
      tex.needsUpdate = true;
      playVideo();
    };

    video.addEventListener("loadedmetadata", handleReady);
    video.addEventListener("canplay", handleReady);
    video.addEventListener("playing", () => setIsReady(true));
    video.addEventListener("loadeddata", handleReady);

    playVideo();
    video.load();

    const onUserInteraction = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    };
    window.addEventListener("click", onUserInteraction, { once: true });
    window.addEventListener("touchstart", onUserInteraction, { once: true });

    videoRef.current = video;
    setTexture(tex);

    return () => {
      window.removeEventListener("click", onUserInteraction);
      window.removeEventListener("touchstart", onUserInteraction);
      video.pause();
      video.removeAttribute("src");
      video.load();
      if (video.parentNode) {
        video.parentNode.removeChild(video);
      }
      tex.dispose();
    };
  }, [url]);

  // Mark texture for update every frame when ready
  useFrame(() => {
    if (texture && videoRef.current && videoRef.current.readyState >= 2) {
      texture.needsUpdate = true;
    }
  });

  return { texture, isReady };
}

// ══════════════════════════════════════════════════════════════════════
//  SURVEILLANCE MONITOR — a physical 3D screen showing a live video
//  feed, with bezel, scanline overlay, amber status glow, and a
//  floating label tag.
// ══════════════════════════════════════════════════════════════════════

function SurveillanceMonitor({ position = [-4.2, 0.4, -0.6], rotation = [0, 0.52, 0], videoData }) {
  const groupRef   = useRef();
  const glowRef    = useRef();
  const scanRef    = useRef();
  const { texture, isReady } = videoData || {};

  const W = 2.4, H = 1.4; // screen width / height

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      // Gentle float
      groupRef.current.position.y = position[1] + Math.sin(t * 0.45) * 0.08;
    }
    if (glowRef.current) {
      // Pulse amber edge glow
      glowRef.current.material.opacity = 0.18 + 0.12 * Math.sin(t * 1.4);
    }
    if (scanRef.current) {
      // Scanline scrolls downward
      scanRef.current.material.map.offset.y = ((t * 0.35) % 1);
      scanRef.current.material.map.needsUpdate = true;
    }
  });

  // Build a scanline canvas texture
  const scanlineTex = useMemo(() => {
    const size   = 256;
    const canvas = document.createElement("canvas");
    canvas.width  = 4;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    for (let y = 0; y < size; y++) {
      ctx.fillStyle = y % 4 === 0
        ? "rgba(0,0,0,0.55)"
        : "rgba(0,0,0,0)";
      ctx.fillRect(0, y, 4, 1);
    }
    const tex        = new THREE.CanvasTexture(canvas);
    tex.wrapS        = THREE.RepeatWrapping;
    tex.wrapT        = THREE.RepeatWrapping;
    tex.repeat.set(W * 8, H * 8);
    return tex;
  }, []);

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* ── Outer bezel frame ── */}
      <mesh>
        <boxGeometry args={[W + 0.18, H + 0.18, 0.06]} />
        <meshStandardMaterial
          color="#0d1f30"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* ── Inner bezel accent (amber edge) ── */}
      <mesh ref={glowRef}>
        <boxGeometry args={[W + 0.14, H + 0.14, 0.065]} />
        <meshBasicMaterial
          color={C.amber}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          wireframe={false}
        />
      </mesh>

      {/* ── Video screen face ── */}
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial
          map={texture || null}
          color={isReady && texture ? "#ffffff" : "#0d1a26"}
          toneMapped={false}
        />
      </mesh>

      {/* ── Scanline overlay ── */}
      <mesh ref={scanRef} position={[0, 0, 0.045]}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial
          map={scanlineTex}
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* ── Screen glow (additive plane behind) ── */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[W + 0.6, H + 0.4]} />
        <meshBasicMaterial
          color={C.steelBlue}
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ── HUD corner label ── */}
      <HudLabel
        text="CAM-01 · OUTPOST BRAVO"
        position={[-(W / 2) + 0.1, (H / 2) - 0.08, 0.05]}
      />
      <HudLabel
        text="◉ REC  24fps  AI:ACTIVE"
        position={[(W / 2) - 0.55, -(H / 2) + 0.08, 0.05]}
        color={"#e74c3c"}
      />

      {/* Amber point light from screen */}
      <pointLight color={C.steelBlue} intensity={0.8} distance={3} decay={2} position={[0, 0, 0.5]} />
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  HUD LABEL — canvas-texture text sprite rendered in the 3D scene
// ══════════════════════════════════════════════════════════════════════
function HudLabel({ text, position, color = C.amber }) {
  const tex = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width  = 512;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 512, 64);
    ctx.fillStyle = color;
    ctx.font      = "bold 22px 'Courier New', monospace";
    ctx.fillText(text, 8, 40);
    const t = new THREE.CanvasTexture(canvas);
    t.needsUpdate = true;
    return t;
  }, [text, color]);

  return (
    <mesh position={position}>
      <planeGeometry args={[1.2, 0.15]} />
      <meshBasicMaterial
        map={tex}
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  SECOND MINI FEED TILE — smaller panel on the right side
// ══════════════════════════════════════════════════════════════════════
const FEED_URL_2 = "/demo.mp4"; // same demo footage, different angle label

function MiniFeedTile({ position = [4.2, 0.8, -0.5], rotation = [0, -0.55, 0], videoData }) {
  const groupRef = useRef();
  const glowRef  = useRef();
  const { texture, isReady } = videoData || {};
  const W = 1.5, H = 0.9;

  const scanlineTex = useMemo(() => {
    const size   = 128;
    const canvas = document.createElement("canvas");
    canvas.width  = 4;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    for (let y = 0; y < size; y++) {
      ctx.fillStyle = y % 3 === 0 ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)";
      ctx.fillRect(0, y, 4, 1);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 4);
    return tex;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current)
      groupRef.current.position.y = position[1] + Math.sin(t * 0.6 + 1.2) * 0.07;
    if (glowRef.current)
      glowRef.current.material.opacity = 0.15 + 0.1 * Math.sin(t * 1.8 + 0.5);
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Bezel */}
      <mesh>
        <boxGeometry args={[W + 0.14, H + 0.14, 0.05]} />
        <meshStandardMaterial color="#0d1f30" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Edge glow */}
      <mesh ref={glowRef}>
        <boxGeometry args={[W + 0.1, H + 0.1, 0.055]} />
        <meshBasicMaterial
          color={C.steelBlue}
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Video face */}
      <mesh position={[0, 0, 0.032]}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial
          map={texture || null}
          color={isReady && texture ? "#ffffff" : "#0d1a26"}
          toneMapped={false}
        />
      </mesh>
      {/* Scanline overlay */}
      <mesh position={[0, 0, 0.038]}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial
          map={scanlineTex}
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </mesh>
      {/* HUD */}
      <HudLabel text="CAM-03 · SECTOR DELTA" position={[-(W / 2) + 0.1, (H / 2) - 0.07, 0.04]} />
      {/* Glow */}
      <pointLight color={C.steelBlue} intensity={0.5} distance={2.5} decay={2} position={[0, 0, 0.4]} />
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  SCAN PARTICLES — amber sweep across terrain surface
// ══════════════════════════════════════════════════════════════════════
function ScanParticles() {
  const pointsRef = useRef();
  const COUNT = 420;

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 20;       // x
      arr[i * 3 + 1] = -3.2 + Math.random() * 0.35;      // y just above terrain
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;       // z
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    // Rolling opacity wave = sweep effect
    const sweep = (Math.sin(t * 0.55) + 1) * 0.5;
    pointsRef.current.material.opacity = 0.18 + sweep * 0.55;
    // Slow rotation for continuous scanning feel
    pointsRef.current.rotation.y = t * 0.04;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        color={C.amber}
        size={0.055}
        sizeAttenuation
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </Points>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  ATMOSPHERE MOTES — subtle floating steel-blue dust
// ══════════════════════════════════════════════════════════════════════
function AtmosphereMotes() {
  const ref = useRef();
  const MOTE_COUNT = 180;

  const positions = useMemo(() => {
    const arr = new Float32Array(MOTE_COUNT * 3);
    for (let i = 0; i < MOTE_COUNT; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.015;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        color={C.steelBlue}
        size={0.03}
        sizeAttenuation
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </Points>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  MOUSE PARALLAX RIG — tilts whole scene toward pointer position
// ══════════════════════════════════════════════════════════════════════
function SceneRig({ children }) {
  const rigRef = useRef();
  const mouse  = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    if (!rigRef.current) return;
    rigRef.current.rotation.x = lerp(rigRef.current.rotation.x, mouse.current.y * 0.06, 0.04);
    rigRef.current.rotation.y = lerp(rigRef.current.rotation.y, mouse.current.x * 0.10, 0.04);
  });

  return <group ref={rigRef}>{children}</group>;
}

// ══════════════════════════════════════════════════════════════════════
//  CAMERA SETUP — command-console tilt (looking slightly down)
// ══════════════════════════════════════════════════════════════════════
function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 5.5, 9.5);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

// ══════════════════════════════════════════════════════════════════════
//  OUTPOST POSITIONS — scattered across the terrain
// ══════════════════════════════════════════════════════════════════════
const OUTPOSTS = [
  [-4.5, -3.0, -3.2],
  [ 3.8, -2.8, -4.5],
  [-2.1, -3.1,  3.8],
  [ 5.2, -3.0,  2.1],
  [ 0.5, -2.9, -6.0],
];

// ══════════════════════════════════════════════════════════════════════
//  SURVEILLANCE MONITORS WRAPPER — shares videoTexture inside Canvas
// ══════════════════════════════════════════════════════════════════════
function SurveillanceMonitors() {
  const videoData = useVideoTexture("/demo.mp4");
  return (
    <>
      <SurveillanceMonitor
        position={[-4.3, 0.4, -0.6]}
        rotation={[0, 0.52, 0]}
        videoData={videoData}
      />
      <MiniFeedTile
        position={[4.1, 0.5, -0.3]}
        rotation={[0, -0.48, 0]}
        videoData={videoData}
      />
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  BORDER HERO SCENE — main export
// ══════════════════════════════════════════════════════════════════════
export default function BorderHeroScene() {
  return (
    <div
      style={{
        position:      "absolute",
        inset:         0,
        width:         "100%",
        height:        "100%",
        pointerEvents: "none",   // never blocks hero section clicks
        overflow:      "hidden",
        zIndex:        0,
      }}
    >
      <Canvas
        shadows={false}
        dpr={[1, 1.5]}
        gl={{
          antialias:       true,
          alpha:           true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
        camera={{ fov: 52, near: 0.1, far: 120 }}
      >
        <CameraSetup />

        {/* ── Global lighting (Daylight Tactical System) ── */}
        <ambientLight color="#FFFDF5" intensity={1.1} />
        <directionalLight color="#FFE8C2" intensity={0.7} position={[6, 12, 8]} />
        <directionalLight color="#8C9D79" intensity={0.3} position={[-6, 6, -10]} />

        {/* ── Parallax rig wraps everything ── */}
        <SceneRig>
          <Terrain />
          <ScanParticles />
          <AtmosphereMotes />

          {OUTPOSTS.map((pos, i) => (
            <OutpostPin key={i} position={pos} />
          ))}
        </SceneRig>
      </Canvas>
    </div>
  );
}

