import React from "react";
import { Video, Cpu, Target, Siren, LayoutDashboard, ArrowRight } from "lucide-react";

const STEPS = [
  {
    icon: Video,
    title: "Camera Feeds",
    sub: "USB · RTSP · HTTP · FILE",
    desc: "Multi-source ingestion",
  },
  {
    icon: Cpu,
    title: "Edge AI Engine",
    sub: "YOLOv11x · ByteTrack",
    desc: "CUDA INT8 inference",
  },
  {
    icon: Target,
    title: "Detection & Tracking",
    sub: "MULTI-CLASS · ROI GATING",
    desc: "Per-object bounding boxes",
  },
  {
    icon: Siren,
    title: "Alert Engine",
    sub: "AUDIO-VISUAL · THRESHOLD",
    desc: "Instant breach notification",
  },
  {
    icon: LayoutDashboard,
    title: "Command Dashboard",
    sub: "RBAC · HLS PLAYBACK",
    desc: "Unified operator view",
  },
];

import ScrollReveal, { ScrollRevealItem } from "./ScrollReveal";

export default function PipelineFlow() {
  return (
    <section className="sec-pipeline" id="pipeline">
      <div className="sec-inner">
        <ScrollReveal y={14}>
          {/* Kicker */}
          <div className="sec-kicker">
            <span className="kicker-pill kicker-pill--dark">
              <span className="kicker-dot" />
              DRISHTI AI · ARCHITECTURE · AI PIPELINE
            </span>
          </div>

          <h2 className="sec-headline sec-headline--light">
            From lens to alert in&nbsp;<span className="text-amber-hl">&lt; 100 ms</span>
          </h2>
          <p className="sec-sub sec-sub--light">
            Every frame traverses a deterministic five-stage pipeline — fully
            on-device, no cloud dependency.
          </p>
        </ScrollReveal>

        {/* Flow with staggered step entrance */}
        <ScrollReveal className="pipeline-flow" stagger staggerDelay={0.09}>
          {STEPS.map(({ icon: Icon, title, sub, desc }, i) => (
            <React.Fragment key={title}>
              <ScrollRevealItem className="pipeline-step" y={18}>
                <div className="pipeline-step__num">{String(i + 1).padStart(2, "0")}</div>
                <div className="pipeline-step__icon">
                  <Icon size={22} strokeWidth={1.6} />
                </div>
                <div className="pipeline-step__title">{title}</div>
                <div className="pipeline-step__sub">{sub}</div>
                <div className="pipeline-step__desc">{desc}</div>
              </ScrollRevealItem>
              {i < STEPS.length - 1 && (
                <div className="pipeline-arrow" aria-hidden="true">
                  <ArrowRight size={18} strokeWidth={1.8} />
                </div>
              )}
            </React.Fragment>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
