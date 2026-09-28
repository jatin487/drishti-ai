import React from "react";
import {
  PersonStanding, Car, ScanLine, ShieldAlert,
  AlertTriangle, Moon, ScanFace, Bell,
} from "lucide-react";

const CAPABILITIES = [
  {
    icon: PersonStanding,
    title: "Human Detection & Tracking",
    desc: "Identifies and follows individuals across camera handoffs in real time.",
  },
  {
    icon: Car,
    title: "Vehicle Detection & Classification",
    desc: "Distinguishes vehicle types and flags unregistered movement patterns.",
  },
  {
    icon: ScanLine,
    title: "Automatic Number Plate Recognition",
    desc: "Reads plates from live feeds and checks them against a watchlist instantly.",
  },
  {
    icon: ShieldAlert,
    title: "Virtual Fence Intrusion Detection",
    desc: "Draws software perimeter lines and alerts the instant one is crossed.",
  },
  {
    icon: AlertTriangle,
    title: "Suspicious Activity Detection",
    desc: "Flags loitering, erratic movement, and other behaviour patterns worth a look.",
  },
  {
    icon: Moon,
    title: "Night-time Movement Detection",
    desc: "Low-light and thermal fusion keep watch when visibility drops.",
  },
  {
    icon: ScanFace,
    title: "Face Detection",
    desc: "Locates and isolates faces in frame for downstream identity workflows.",
  },
  {
    icon: Bell,
    title: "Real-time Alerts & Event Logging",
    desc: "Every detection becomes a timestamped, searchable event on the dashboard.",
  },
];

import ScrollReveal, { ScrollRevealItem } from "./ScrollReveal";

export default function CapabilityGrid() {
  return (
    <section className="sec-capability" id="capabilities">
      <div className="sec-inner">
        <ScrollReveal y={14}>
          {/* Kicker */}
          <div className="sec-kicker">
            <span className="kicker-pill">
              <span className="kicker-dot" />
              DRISHTI AI · CAPABILITIES · FULL SPECTRUM
            </span>
          </div>

          {/* Headline */}
          <h2 className="sec-headline">
            Every angle of the perimeter,<br />covered
          </h2>
          <p className="sec-sub">
            One AI pipeline running across your existing camera network handles
            detection, tracking, and alerting — no added hardware per capability.
          </p>
        </ScrollReveal>

        {/* Grid with staggered card entrance */}
        <ScrollReveal className="cap-grid" stagger staggerDelay={0.07}>
          {CAPABILITIES.map(({ icon: Icon, title, desc }) => (
            <ScrollRevealItem className="cap-card" key={title} y={16}>
              <div className="cap-card__icon-wrap">
                <Icon size={20} strokeWidth={1.7} />
              </div>
              <h3 className="cap-card__title">{title}</h3>
              <p className="cap-card__desc">{desc}</p>
            </ScrollRevealItem>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
