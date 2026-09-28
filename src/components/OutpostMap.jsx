import React from "react";

const OUTPOSTS = [
  { id: "ALPHA",  label: "OUTPOST ALPHA",   cx: 168, cy: 95,  status: "online"   },
  { id: "BRAVO",  label: "OUTPOST BRAVO",   cx: 310, cy: 175, status: "critical" },
  { id: "CHARLIE",label: "OUTPOST CHARLIE", cx: 510, cy: 120, status: "online"   },
  { id: "DELTA",  label: "WATCHTOWER DELTA",cx: 420, cy: 255, status: "online"   },
  { id: "ECHO",   label: "OUTPOST ECHO",    cx: 255, cy: 295, status: "online"   },
];

// Build faint SVG contour lines (decorative grid)
const CONTOUR_LINES = [
  "M 0 80 Q 150 60 300 90 Q 450 120 640 75",
  "M 0 160 Q 120 140 260 165 Q 420 190 640 150",
  "M 0 240 Q 180 220 340 250 Q 490 275 640 230",
  "M 0 310 Q 200 295 380 315 Q 530 335 640 305",
];

import ScrollReveal from "./ScrollReveal";

export default function OutpostMap() {
  return (
    <section className="sec-map" id="network">
      <div className="sec-inner">
        <ScrollReveal y={14}>
          <div className="sec-kicker">
            <span className="kicker-pill">
              <span className="kicker-dot" />
              DRISHTI AI · DEPLOYMENT · OUTPOST NETWORK
            </span>
          </div>
          <h2 className="sec-headline">Live outpost network</h2>
          <p className="sec-sub">
            Five active surveillance outposts reporting in real time. One in
            critical state — perimeter breach risk elevated.
          </p>
        </ScrollReveal>

        {/* Map Panel with reveal */}
        <ScrollReveal y={20} delay={0.1}>
          <div className="map-panel">
          {/* Panel header HUD */}
          <div className="map-hud-header">
            <span className="map-hud-rec">● REC</span>
            <span className="map-hud-title">SECTOR GRID · OPERATIONAL OVERLAY</span>
            <span className="map-hud-pill map-hud-pill--live">
              <span className="live-dot" /> 5 NODES ONLINE
            </span>
          </div>

          {/* Corner brackets */}
          <div className="map-corner tl" />
          <div className="map-corner tr" />
          <div className="map-corner bl" />
          <div className="map-corner br" />

          <svg
            viewBox="0 0 640 370"
            className="map-svg"
            aria-label="Outpost network map"
          >
            {/* Faint grid */}
            {Array.from({ length: 9 }).map((_, i) => (
              <line
                key={`v${i}`}
                x1={i * 80} y1="0" x2={i * 80} y2="370"
                stroke="#4A90C0" strokeWidth="0.4" opacity="0.18"
              />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <line
                key={`h${i}`}
                x1="0" y1={i * 74} x2="640" y2={i * 74}
                stroke="#4A90C0" strokeWidth="0.4" opacity="0.18"
              />
            ))}

            {/* Contour lines */}
            {CONTOUR_LINES.map((d, i) => (
              <path
                key={i} d={d}
                stroke="#4A90C0" strokeWidth="0.7"
                fill="none" opacity="0.22"
              />
            ))}

            {/* Outpost markers */}
            {OUTPOSTS.map(({ id, label, cx, cy, status }) => {
              const isCrit = status === "critical";
              const color  = isCrit ? "#EF4444" : "#C47C1A";
              const glow   = isCrit ? "rgba(239,68,68,0.35)" : "rgba(196,124,26,0.35)";

              return (
                <g key={id}>
                  {/* Glow halo — pulsing for critical */}
                  <circle
                    cx={cx} cy={cy} r={isCrit ? 22 : 18}
                    fill={glow}
                    className={isCrit ? "map-pulse-crit" : "map-pulse-ok"}
                  />
                  {/* Outer ring */}
                  <circle
                    cx={cx} cy={cy} r={11}
                    fill="none"
                    stroke={color} strokeWidth="1.4"
                    opacity="0.7"
                  />
                  {/* Inner dot */}
                  <circle cx={cx} cy={cy} r={4.5} fill={color} />

                  {/* Label */}
                  <rect
                    x={cx + 15} y={cy - 11}
                    width={label.length * 5.4 + 10} height={20}
                    rx="3"
                    fill="rgba(6,13,24,0.82)"
                    stroke={color} strokeWidth="0.8"
                  />
                  <text
                    x={cx + 20} y={cy + 3}
                    fill={color}
                    fontSize="8"
                    fontFamily="'JetBrains Mono', monospace"
                    fontWeight="700"
                    letterSpacing="0.08em"
                  >
                    {label}
                  </text>

                  {/* Critical tag */}
                  {isCrit && (
                    <>
                      <rect
                        x={cx + 15} y={cy + 12}
                        width={62} height={14}
                        rx="2"
                        fill="rgba(239,68,68,0.15)"
                        stroke="#EF4444" strokeWidth="0.7"
                      />
                      <text
                        x={cx + 20} y={cy + 22}
                        fill="#EF4444"
                        fontSize="6.5"
                        fontFamily="'JetBrains Mono', monospace"
                        fontWeight="800"
                        letterSpacing="0.1em"
                      >
                        ⚠ CRITICAL
                      </text>
                    </>
                  )}
                </g>
              );
            })}

            {/* Range radar circle from BRAVO */}
            <circle
              cx={310} cy={175} r={70}
              fill="none"
              stroke="#EF4444"
              strokeWidth="0.6"
              strokeDasharray="4 3"
              opacity="0.35"
              className="map-pulse-crit"
            />
          </svg>

          {/* Legend */}
          <div className="map-legend">
            <span className="legend-item">
              <span className="legend-dot legend-dot--amber" /> ONLINE
            </span>
            <span className="legend-item">
              <span className="legend-dot legend-dot--red" /> CRITICAL
            </span>
            <span className="legend-item legend-item--mono">
              COORD: 32°44′N · 74°52′E
            </span>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
);
}
