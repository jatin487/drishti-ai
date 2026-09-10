import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

export default function FinalCTA() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="sec-cta">
      {/* Background grid texture */}
      <div className="cta-grid-bg" aria-hidden="true" />

      <div className="sec-inner cta-inner">
        <ScrollReveal y={16}>
          {/* Top kicker */}
          <div className="sec-kicker">
            <span className="kicker-pill kicker-pill--dark">
              <span className="kicker-dot" />
              DRISHTI-X · AUTONOMOUS THREAT INTELLIGENCE · DEFENSE GRADE
            </span>
          </div>

          <h2 className="cta-headline">
            Deploy DRISHTI-X at your<br />next outpost
          </h2>

          <p className="cta-sub">
            Bring autonomous visual threat intelligence to cameras you already have.
            No new hardware, no added crew.
          </p>

          {/* Buttons with micro-interaction lift */}
          <div className="cta-actions">
            <motion.a
              href="http://localhost:5001/login"
              className="btn btn--primary cta-btn-primary"
              whileHover={shouldReduceMotion ? {} : { y: -2 }}
              transition={{ duration: 0.16 }}
            >
              Access Dashboard →
            </motion.a>
            <motion.button
              className="btn cta-btn-ghost"
              whileHover={shouldReduceMotion ? {} : { y: -2 }}
              transition={{ duration: 0.16 }}
            >
              Request a Demo
            </motion.button>
          </div>

        </ScrollReveal>

        {/* Continuous Scrolling Defense Ticker Ribbon (CSIR-CSIO & Intel stream) */}
        <div className="cta-ticker-wrapper" aria-hidden="true">
          <div className="cta-ticker-track">
            <div className="cta-ticker-group">
              <span className="ticker-item">
                <span className="ticker-dot-amber" /> CSIR-CSIO · CHANDIGARH
              </span>
              <span className="ticker-sep">/</span>
              <span className="ticker-item">
                <span className="ticker-dot-green" /> MINISTRY OF SCIENCE &amp; TECHNOLOGY · GOVT. OF INDIA
              </span>
              <span className="ticker-sep">/</span>
              <span className="ticker-item">
                <span className="ticker-dot-amber" /> DRISHTI-X AUTONOMOUS BORDER SURVEILLANCE
              </span>
              <span className="ticker-sep">/</span>
              <span className="ticker-item">
                <span className="ticker-dot-green" /> YOLOv11x INT8 · EDGE INFERENCE &lt; 100MS
              </span>
              <span className="ticker-sep">/</span>
              <span className="ticker-item">
                <span className="ticker-dot-amber" /> DEFCON 2 OPERATIONAL READINESS
              </span>
              <span className="ticker-sep">/</span>
              <span className="ticker-item">
                <span className="ticker-dot-green" /> 5 OUTPOST NODES SYNCHRONIZED
              </span>
              <span className="ticker-sep">/</span>
            </div>
            <div className="cta-ticker-group" aria-hidden="true">
              <span className="ticker-item">
                <span className="ticker-dot-amber" /> CSIR-CSIO · CHANDIGARH
              </span>
              <span className="ticker-sep">/</span>
              <span className="ticker-item">
                <span className="ticker-dot-green" /> MINISTRY OF SCIENCE &amp; TECHNOLOGY · GOVT. OF INDIA
              </span>
              <span className="ticker-sep">/</span>
              <span className="ticker-item">
                <span className="ticker-dot-amber" /> DRISHTI-X AUTONOMOUS BORDER SURVEILLANCE
              </span>
              <span className="ticker-sep">/</span>
              <span className="ticker-item">
                <span className="ticker-dot-green" /> YOLOv11x INT8 · EDGE INFERENCE &lt; 100MS
              </span>
              <span className="ticker-sep">/</span>
              <span className="ticker-item">
                <span className="ticker-dot-amber" /> DEFCON 2 OPERATIONAL READINESS
              </span>
              <span className="ticker-sep">/</span>
              <span className="ticker-item">
                <span className="ticker-dot-green" /> 5 OUTPOST NODES SYNCHRONIZED
              </span>
              <span className="ticker-sep">/</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
