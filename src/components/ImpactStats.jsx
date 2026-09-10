import React from "react";
import ScrollReveal, { ScrollRevealItem } from "./ScrollReveal";

const STATS = [
  { value: "5",     suffix: "",   label: "Active Outposts",     sub: "OPERATIONAL NODES"  },
  { value: "98.4",  suffix: "%",  label: "Detection Accuracy",  sub: "YOLOv11x · INT8"    },
  { value: "24",    suffix: "/7", label: "Monitoring Coverage", sub: "ALL SECTORS · LIVE"  },
  { value: "< 100", suffix: "ms", label: "Inference Latency",   sub: "EDGE · GPU ACCELERATED" },
];

export default function ImpactStats() {
  return (
    <section className="sec-impact">
      <div className="sec-inner">
        <ScrollReveal y={14}>
          {/* Kicker */}
          <div className="sec-kicker">
            <span className="kicker-pill kicker-pill--dark">
              <span className="kicker-dot" />
              DRISHTI-X · PERFORMANCE · PROVEN METRICS
            </span>
          </div>

          <h2 className="sec-headline sec-headline--light">
            Built for the hardest terrain
          </h2>
          <p className="sec-sub sec-sub--light">
            Tested across multi-camera deployments in variable lighting,
            weather conditions, and bandwidth-constrained environments.
          </p>
        </ScrollReveal>

        {/* Stats row */}
        <ScrollReveal className="impact-grid" stagger staggerDelay={0.08}>
          {STATS.map(({ value, suffix, label, sub }) => (
            <ScrollRevealItem className="impact-stat" key={label} y={16}>
              <div className="impact-stat__val">
                {value}<span className="impact-stat__suf">{suffix}</span>
              </div>
              <div className="impact-stat__label">{label}</div>
              <div className="impact-stat__sub">{sub}</div>
            </ScrollRevealItem>
          ))}
        </ScrollReveal>

        {/* Bottom rule */}
        <ScrollReveal y={10} delay={0.2}>
          <div className="impact-divider" />
          <div className="impact-footer-row">
            <span className="impact-footer-item">
              <span className="live-dot" /> SENSOR NETWORK SYNCHRONIZED
            </span>
            <span className="impact-footer-sep">·</span>
            <span className="impact-footer-item">DEFCON 2 ACTIVE</span>
            <span className="impact-footer-sep">·</span>
            <span className="impact-footer-item">ALL SYSTEMS NOMINAL</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
