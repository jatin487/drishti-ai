/**
 * TacticalSensorAccent.jsx
 * ─────────────────────────────────────────────────────────────────────
 * A small, self-contained R3F scene rendered as a floating accent.
 * Intended to sit in the LEFT hero column — alongside the headline text
 * — as a secondary visual, ~30% the size of the main video on the right.
 *
 * Contains:
 *  • A stylised PTZ surveillance camera body (box + cylinder lens barrel)
 *  • An amber glowing lens disc at the front of the barrel
 *  • Two rotating radar / halo rings (amber + steel-blue)
 *  • Ambient amber fill light + directional key
 *  • Slow continuous Y-rotation + gentle bob animation
 *
 * Intentional z-index / pointer behaviour:
 *  • The wrapping <div> uses position:relative, no overlap with the video.
 *  • Canvas has pointer-events:none — clicks pass through to anything behind.
 *  • Sits entirely within the left column flex flow; right-column video
 *    is unaffected and stacks above the 3D canvas in DOM order.
 * ─────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ── Shared palette (matches App.css tokens) ─────────────────────────── */
const AMBER      = new THREE.Color("#C47C1A");
const AMBER_LT   = new THREE.Color("#E8A33D");
const STEEL      = new THREE.Color("#4A90C0");
const DARK_BODY  = new THREE.Color("#0D1B2A");
const GREY_BODY  = new THREE.Color("#1E3A52");

/* ════════════════════════════════════════════════════════════════════════
   CAMERA BODY — PTZ-style surveillance unit
   ════════════════════════════════════════════════════════════════════════ */
function SensorBody() {
  return (
    <group>
      {/* Main housing box */}
      <mesh castShadow>
        <boxGeometry args={[0.9, 0.55, 0.65]} />
        <meshStandardMaterial color={GREY_BODY} roughness={0.35} metalness={0.75} />
      </mesh>

      {/* Top ridge accent */}
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[0.7, 0.08, 0.45]} />
        <meshStandardMaterial color={DARK_BODY} roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Front lens barrel (cylinder along Z) */}
      <mesh position={[0, -0.02, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.17, 0.2, 0.38, 24]} />
        <meshStandardMaterial color={DARK_BODY} roughness={0.25} metalness={0.9} />
      </mesh>

      {/* Lens rim ring */}
      <mesh position={[0, -0.02, 0.62]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.17, 0.025, 12, 32]} />
        <meshStandardMaterial color={AMBER} roughness={0.2} metalness={0.85}
          emissive={AMBER} emissiveIntensity={0.6} />
      </mesh>

      {/* Glowing amber lens disc */}
      <mesh position={[0, -0.02, 0.635]}>
        <circleGeometry args={[0.14, 36]} />
        <meshStandardMaterial
          color={AMBER_LT}
          emissive={AMBER_LT}
          emissiveIntensity={1.8}
          roughness={0.0}
          metalness={0.1}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Small mounting bracket underneath */}
      <mesh position={[0, -0.36, 0]}>
        <boxGeometry args={[0.22, 0.16, 0.22]} />
        <meshStandardMaterial color={DARK_BODY} roughness={0.4} metalness={0.75} />
      </mesh>
    </group>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   RADAR RINGS — two counter-rotating halo rings around the camera
   ════════════════════════════════════════════════════════════════════════ */
function RadarRings() {
  const ring1 = useRef();
  const ring2 = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ring1.current) ring1.current.rotation.z =  t * 0.4;
    if (ring2.current) ring2.current.rotation.z = -t * 0.28;
  });

  return (
    <group>
      {/* Outer amber ring — tilted 15° on X */}
      <mesh ref={ring1} rotation={[0.26, 0, 0]}>
        <torusGeometry args={[1.15, 0.012, 8, 64]} />
        <meshBasicMaterial color={AMBER} transparent opacity={0.55} />
      </mesh>

      {/* Inner steel-blue ring — tilted -10° */}
      <mesh ref={ring2} rotation={[-0.18, 0.3, 0]}>
        <torusGeometry args={[0.82, 0.009, 8, 64]} />
        <meshBasicMaterial color={STEEL} transparent opacity={0.45} />
      </mesh>

      {/* Tiny orbit tick dots on the outer ring */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
        <mesh
          key={i}
          ref={(el) => {
            // piggyback on ring1 rotation by parenting in JSX isn't needed;
            // dots are static decorative accents at fixed positions
          }}
          position={[
            Math.cos(angle) * 1.15,
            Math.sin(angle) * 1.15 * 0.26,   // squish to match ring tilt
            0,
          ]}
        >
          <sphereGeometry args={[0.028, 8, 8]} />
          <meshBasicMaterial color={AMBER_LT} />
        </mesh>
      ))}
    </group>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SCAN BEAM — a thin line sweeping outward (radar sweep aesthetic)
   ════════════════════════════════════════════════════════════════════════ */
function ScanBeam() {
  const ref = useRef();

  const points = useMemo(() => {
    const arr = [];
    for (let i = 0; i <= 32; i++) {
      const t = i / 32;
      arr.push(new THREE.Vector3(t * 1.1, 0, 0));
    }
    return arr;
  }, []);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(points);
    return g;
  }, [points]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.7;
    }
  });

  return (
    <line ref={ref} geometry={geom}>
      <lineBasicMaterial color={AMBER} transparent opacity={0.35} />
    </line>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   ROOT ANIMATED GROUP — slow Y rotation + bob
   ════════════════════════════════════════════════════════════════════════ */
function SceneRoot() {
  const group = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.35;
      group.current.position.y = Math.sin(t * 0.7) * 0.06;
    }
  });

  return (
    <group ref={group}>
      {/* Lights */}
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 5, 3]} intensity={1.1} color="#ffffff" />
      <pointLight position={[0, 0, 1.2]} color={AMBER_LT} intensity={2.2} distance={3.5} />

      {/* Scene objects */}
      <SensorBody />
      <RadarRings />
      <ScanBeam />
    </group>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   EXPORTED COMPONENT
   ════════════════════════════════════════════════════════════════════════ */
export default function TacticalSensorAccent() {
  return (
    <div className="sensor-accent-wrap" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.4, 3.2], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: "none", background: "transparent" }}
      >
        <SceneRoot />
      </Canvas>

      {/* Decorative corner label */}
      <div className="sensor-accent-label">
        <span className="sal-dot" />
        PTZ · AI-SERVO · 4K
      </div>
    </div>
  );
}
