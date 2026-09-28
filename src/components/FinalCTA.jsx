import React from "react";
import ScrollReveal from "./ScrollReveal";

export default function FinalCTA() {

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
              DRISHTI AI · AUTONOMOUS THREAT INTELLIGENCE · DEFENSE GRADE
            </span>
          </div>

          <h2 className="cta-headline">
            Deploy Drishti AI at your<br />next outpost
          </h2>

          <p className="cta-sub">
            Bring autonomous visual threat intelligence to cameras you already have.
            No new hardware, no added crew.
          </p>



        </ScrollReveal>

        {/* Continuous Scrolling Defense Ticker Ribbon */}
        <div className="cta-ticker-wrapper" aria-hidden="true">
          <div className="cta-ticker-track">
            <div className="cta-ticker-group">
              <span className="ticker-item">
                <span className="ticker-dot-amber" /> DRISHTI AI AUTONOMOUS BORDER SURVEILLANCE
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
                <span className="ticker-dot-amber" /> DRISHTI AI AUTONOMOUS BORDER SURVEILLANCE
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
