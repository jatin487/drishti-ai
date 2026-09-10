import React from "react";
import PerimeterHeroMap from "./PerimeterHeroMap";
import ScrollReveal from "./ScrollReveal";

export default function PerimeterSection() {
  return (
    <section className="sec-perimeter" id="perimeter">
      <div className="sec-inner">
        <ScrollReveal y={14}>
          {/* Kicker Pill */}
          <div className="sec-kicker">
            <span className="kicker-pill">
              <span className="kicker-dot" />
              DRISHTI-X · PERIMETER SURVEILLANCE · ELEVATED SCHEMATIC
            </span>
          </div>

          {/* Headline & Subtitle */}
          <h2 className="sec-headline">Autonomous Border Perimeter Schematic</h2>
          <p className="sec-sub">
            Continuous elevated optical and sensor monitoring along the virtual boundary fence.
            Interact with active sensor nodes, radar sweeps, and live detection telemetry in real time.
          </p>
        </ScrollReveal>

        {/* Full-width Light Tactical Perimeter Visual Map */}
        <ScrollReveal y={20} delay={0.1}>
          <div className="perimeter-section-map-wrapper">
            <PerimeterHeroMap />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
