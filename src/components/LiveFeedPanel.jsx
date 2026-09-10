import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Animated counter hook for confidence percentage (0% -> target% over 600ms)
 */
function AnimatedConfidence({ targetValue, duration = 600 }) {
  const [val, setVal] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setVal(targetValue);
      return;
    }
    let startTime = null;
    let frameId;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(easeOutProgress * targetValue));
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [targetValue, duration, shouldReduceMotion]);

  return <span className="tag-conf tabular-nums">{val}%</span>;
}

/**
 * LiveFeedPanel Component
 * Centerpiece live tactical surveillance terminal.
 * Features:
 * - Double-blink flicker entrance for AI bounding boxes
 * - Animated confidence percentage counter (0 -> target%)
 * - Continuous horizontal scanning line sweep
 * - Overshoot drop-in for PERIMETER BREACH RISK alert banner with pulsing icon
 * - Steady discrete on/off blink on 'REC' dot
 * - Slow breathing scale animation on center reticle
 */
export default function LiveFeedPanel({
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

  // Bounding box flicker variants
  const boxVariants = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: (customDelay) => ({
      opacity: shouldReduceMotion ? 1 : [0, 1, 0.35, 1],
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.45,
        delay: customDelay,
        times: [0, 0.4, 0.65, 1],
        ease: "easeInOut",
      },
    }),
  };

  return (
    <div className="surveillance-terminal" id="console">
      {/* Terminal Header */}
      <div className="terminal-header">
        <div className="terminal-cam-info">
          {/* Steady discrete 1s blinking REC dot */}
          <span className="cam-pulse-rec steady-blink">● REC</span>
          <span className="cam-id">{activeCam.id}</span>
          <span className="cam-name">{activeCam.name}</span>
          <span className="cam-sector">{activeCam.sector}</span>
        </div>
        <div className="terminal-badges">
          <span className="terminal-pill">1080P HEVC</span>
          <span className="terminal-pill">24 FPS</span>
          <span className="terminal-pill threat-pill">{activeCam.threat}</span>
        </div>
      </div>

      {/* Video Screen Box with Overlays */}
      <div className="terminal-screen-wrapper">
        <video
          ref={videoRef}
          src="/demo.mp4"
          loop
          muted={isMuted}
          autoPlay
          playsInline
          className={`terminal-video vision-${visionMode}${isTransitioning ? " vision-transitioning" : ""}`}
        />

        {/* Continuous Horizontal Scanning Sweep Line */}
        <div className="hud-scanline-sweep" aria-hidden="true" />

        {/* Vignette */}
        <div className="screen-vignette" />

        {/* Tactical Corner Brackets */}
        <div className="hud-corner-bracket tl" />
        <div className="hud-corner-bracket tr" />
        <div className="hud-corner-bracket bl" />
        <div className="hud-corner-bracket br" />

        {/* Center Crosshair with Subtle Breathing Scale Animation */}
        <motion.div
          className="hud-reticle-crosshair"
          animate={
            shouldReduceMotion
              ? {}
              : {
                  scale: [1, 1.035, 1],
                }
          }
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Timestamp HUD */}
        <div className="hud-screen-timestamp">
          <span className="ts-tag">LIVE FEED</span>
          <span className="ts-time tabular-nums">{currentTime}</span>
        </div>

        {/* AI Target Bounding Boxes */}
        {showAiOverlay && (
          <div className="ai-overlay">
            {/* Target 1 */}
            <motion.div
              className="ai-target-box box-1"
              custom={0.1}
              initial="hidden"
              animate="visible"
              variants={boxVariants}
            >
              <div className="ai-target-tag">
                <span className="tag-label">PERSON</span>
                <AnimatedConfidence targetValue={91} />
              </div>
              <div className="target-reticle tl" />
              <div className="target-reticle br" />
            </motion.div>

            {/* Target 2 */}
            <motion.div
              className="ai-target-box box-2"
              custom={0.25}
              initial="hidden"
              animate="visible"
              variants={boxVariants}
            >
              <div className="ai-target-tag">
                <span className="tag-label">PERSON</span>
                <AnimatedConfidence targetValue={95} />
              </div>
              <div className="target-reticle tl" />
              <div className="target-reticle br" />
            </motion.div>

            {/* Target 3 */}
            <motion.div
              className="ai-target-box box-3"
              custom={0.4}
              initial="hidden"
              animate="visible"
              variants={boxVariants}
            >
              <div className="ai-target-tag">
                <span className="tag-label">PERSON</span>
                <AnimatedConfidence targetValue={92} />
              </div>
              <div className="target-reticle tl" />
              <div className="target-reticle br" />
            </motion.div>

            {/* Perimeter Breach Alert Banner: Slide-in with overshoot bounce */}
            <motion.div
              className="hud-alert-banner"
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 20,
                mass: 0.8,
              }}
            >
              <motion.span
                className="alert-icon"
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        scale: [1, 1.2, 1],
                      }
                }
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ⚠
              </motion.span>
              <span className="alert-text">PERIMETER BREACH RISK · 4 TARGETS TRACKED</span>
            </motion.div>
          </div>
        )}

        {/* Vision Mode Indicator */}
        <div className={`hud-vision-badge vision-badge--${visionMode}`}>
          VISION: {filterLabels[visionMode]}
        </div>

        {/* Auto-cycle indicator */}
        {autoCycle && (
          <div className="hud-autocycle-badge">
            <span className="autocycle-dot" />
            AUTO
          </div>
        )}
      </div>

      {/* Terminal Interactive Controls Bar */}
      <div className="terminal-controls-bar">
        <div className="ctrl-group">
          <button className="ctrl-btn" onClick={togglePlay} title="Play / Pause">
            {isPlaying ? "❚❚ PAUSE" : "▶ PLAY"}
          </button>
          <button className="ctrl-btn" onClick={() => setIsMuted(!isMuted)} title="Toggle Mute">
            {isMuted ? "🔇 UNMUTE" : "🔊 MUTE"}
          </button>
          <button
            className={`ctrl-btn ${showAiOverlay ? "ctrl-btn--active" : ""}`}
            onClick={() => setShowAiOverlay(!showAiOverlay)}
            title="Toggle AI Threat Overlays"
          >
            AI HUD: {showAiOverlay ? "ON" : "OFF"}
          </button>
        </div>

        {/* Vision Filter Switchers */}
        <div className="vision-mode-group">
          <span className="vision-lbl">FILTER:</span>
          {filters.map((f) => (
            <button
              key={f}
              className={`vision-btn vision-btn--${f} ${visionMode === f && !autoCycle ? "active" : visionMode === f ? "active" : ""}`}
              onClick={() => handleFilterClick(f)}
            >
              {filterLabels[f]}
            </button>
          ))}
          <button
            className={`vision-btn vision-btn--auto ${autoCycle ? "active" : ""}`}
            onClick={() => setAutoCycle((p) => !p)}
            title="Toggle auto-cycle"
          >
            AUTO
          </button>
        </div>

        <button className="ctrl-btn ctrl-btn--snapshot" onClick={captureSnapshot}>
          📸 SNAPSHOT
        </button>
      </div>

    </div>
  );
}
