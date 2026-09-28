import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import BorderHeroScene from "./BorderHeroScene";
import LiveFeedPanel from "./LiveFeedPanel";

const ROTATING_PHRASES = [
  "AUTONOMOUS THREAT DETECTION",
  "PERIMETER SURVEILLANCE ACTIVE",
  "AI-POWERED VISUAL ANALYTICS",
  "360° BORDER INTELLIGENCE",
  "REAL-TIME TARGET TRACKING",
  "MULTI-SPECTRAL MONITORING",
];

export default function Hero({
  activeCam,
  cameras,
  onSelectCamera,
  isPlaying,
  togglePlay,
  isMuted,
  setIsMuted,
  showAiOverlay,
  setShowAiOverlay,
  visionMode,
  filterLabels,
  filters,
  handleFilterClick,
  autoCycle,
  setAutoCycle,
  captureSnapshot,
  currentTime,
  videoRef,
  isTransitioning,
}) {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, 180]);

  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setPhraseIdx((i) => (i + 1) % ROTATING_PHRASES.length);
    }, 2400);
    return () => clearInterval(t);
  }, []);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: shouldReduceMotion ? 1 : 0.94 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  const amberXVariants = {
    hidden: { filter: "drop-shadow(0 0 0px rgba(194, 121, 12, 0))" },
    visible: {
      filter: shouldReduceMotion
        ? "drop-shadow(0 0 0px rgba(194, 121, 12, 0))"
        : [
            "drop-shadow(0 0 0px rgba(194, 121, 12, 0))",
            "drop-shadow(0 0 22px rgba(194, 121, 12, 1))",
            "drop-shadow(0 0 6px rgba(194, 121, 12, 0.4))",
          ],
      transition: { delay: 0.5, duration: 1.0, times: [0, 0.45, 1], ease: "easeOut" },
    },
  };

  return (
    <section className="hero">
      {/* Parallax background */}
      <motion.div
        className="hero-parallax-bg"
        style={{ y: shouldReduceMotion ? 0 : bgY, position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <BorderHeroScene />
      </motion.div>

      <div className="hero__overlay" />

      <div className="hero__container">
        {/* ── Left Column: Animated DRISHTI-X ── */}
        <motion.div
          className="hero__col-left"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Scan line accent */}
          <motion.div className="hero-scan-line" variants={itemVariants} />

          {/* Status row */}
          <motion.div className="hero-status-row" variants={itemVariants}>
            <span className="hero-status-dot" />
            <span className="hero-status-label">SYSTEM ONLINE</span>
            <span className="hero-status-sep">·</span>
            <span className="hero-status-label">DEFCON 2</span>
            <span className="hero-status-sep">·</span>
            <span className="hero-status-label">4 CAMS ACTIVE</span>
          </motion.div>

          {/* DRISHTI AI glitch title */}
          <motion.h1 className="hero__title" variants={titleVariants}>
            <span className="title-brand hero-glitch" data-text="DRISHTI AI">
              DRISHTI{" "}
              <motion.span className="brand-x" variants={amberXVariants}>
                AI
              </motion.span>
            </span>
          </motion.h1>

          {/* Animated rotating phrase */}
          <motion.div className="hero-rotating-wrap" variants={itemVariants}>
            <span className="hero-rotating-prefix">▸</span>
            <div className="hero-rotating-text-box">
              <AnimatePresence mode="wait">
                <motion.span
                  key={phraseIdx}
                  className="hero-rotating-phrase"
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.38, ease: "easeOut" }}
                >
                  {ROTATING_PHRASES[phraseIdx]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Animated metric indicators */}
          <motion.div className="hero-metrics-row" variants={itemVariants}>
            {[
              { val: "99.7%", lbl: "DETECTION RATE" },
              { val: "<0.3s", lbl: "ALERT LATENCY" },
              { val: "247km", lbl: "PERIMETER" },
            ].map((m) => (
              <div className="hero-metric-chip" key={m.lbl}>
                <span className="hero-metric-val">{m.val}</span>
                <span className="hero-metric-lbl">{m.lbl}</span>
              </div>
            ))}
          </motion.div>

          {/* Animated progress bar */}
          <motion.div className="hero-threat-bar-wrap" variants={itemVariants}>
            <div className="hero-threat-bar-label">
              <span>THREAT SCAN</span>
              <span className="hero-threat-bar-pct">87%</span>
            </div>
            <div className="hero-threat-bar-track">
              <motion.div
                className="hero-threat-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: "87%" }}
                transition={{ delay: 1, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* ── Right Column: Live Feed ── */}
        <motion.div
          className="hero__col-right"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <LiveFeedPanel
            activeCam={activeCam}
            cameras={cameras}
            onSelectCamera={onSelectCamera}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            showAiOverlay={showAiOverlay}
            setShowAiOverlay={setShowAiOverlay}
            visionMode={visionMode}
            filterLabels={filterLabels}
            filters={filters}
            handleFilterClick={handleFilterClick}
            autoCycle={autoCycle}
            setAutoCycle={setAutoCycle}
            captureSnapshot={captureSnapshot}
            currentTime={currentTime}
            videoRef={videoRef}
            isTransitioning={isTransitioning}
          />
        </motion.div>
      </div>

      {/* Scanbar strip */}
      <div className="hero__scanbar">
        {Array.from({ length: 48 }).map((_, i) => (
          <div key={i} className="scanbar__tick" />
        ))}
      </div>
    </section>
  );
}
