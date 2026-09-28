import React from "react";
import { ShieldAlert, Car, AlertTriangle, Moon } from "lucide-react";

const ALERTS = [
  {
    severity: "critical",
    icon: ShieldAlert,
    title: "Intrusion Detected",
    desc: "Two persons crossed the virtual perimeter on the north boundary. ByteTrack IDs 024 and 025 confirmed.",
    time: "06:43:21 UTC",
    location: "OUTPOST BRAVO · CAM-01",
    trackId: "TRACK ID 024–025",
  },
  {
    severity: "warning",
    icon: Car,
    title: "Vehicle Flagged",
    desc: "Unregistered plate matched watchlist entry. Vehicle stationary for > 4 min in restricted zone.",
    time: "06:38:05 UTC",
    location: "OUTPOST ALPHA · CAM-03",
    trackId: "VEHICLE ID 007",
  },
  {
    severity: "warning",
    icon: AlertTriangle,
    title: "Suspicious Activity",
    desc: "Loitering pattern detected near perimeter wire. Subject stopped for 8+ minutes without movement.",
    time: "06:31:44 UTC",
    location: "WATCHTOWER DELTA · CAM-02",
    trackId: "TRACK ID 018",
  },
  {
    severity: "info",
    icon: Moon,
    title: "Night Movement Detected",
    desc: "Thermal signature confirmed. Low-visibility mode engaged. Motion gated via MOG2 background model.",
    time: "06:12:09 UTC",
    location: "OUTPOST ECHO · CAM-04",
    trackId: "TRACK ID 031",
  },
];

import ScrollReveal, { ScrollRevealItem } from "./ScrollReveal";

export default function AlertFeed() {
  return (
    <section className="sec-alerts" id="alerts">
      <div className="sec-inner">
        <ScrollReveal y={14}>
          <div className="sec-kicker">
            <span className="kicker-pill">
              <span className="kicker-dot kicker-dot--red" />
              DRISHTI AI · ALERT FEED · LIVE EVENTS
            </span>
          </div>
          <h2 className="sec-headline">Recent detections</h2>
          <p className="sec-sub">
            Every AI event is time-stamped, camera-tagged, and archived to the
            immutable JSONL event log for post-incident review.
          </p>
        </ScrollReveal>

        <ScrollReveal className="alert-grid" stagger staggerDelay={0.08}>
          {ALERTS.map(({ severity, icon: Icon, title, desc, time, location, trackId }) => (
            <ScrollRevealItem className={`alert-card alert-card--${severity}`} key={title} y={16}>
              <div className="alert-card__accent" />

              <div className="alert-card__header">
                <div className={`alert-card__icon-wrap alert-icon--${severity}`}>
                  <Icon size={16} strokeWidth={1.8} />
                </div>
                <div>
                  <div className="alert-card__title">{title}</div>
                  <div className="alert-card__location">{location}</div>
                </div>
                <div className={`alert-card__sev-badge sev--${severity}`}>
                  {severity === "critical" ? "CRITICAL" : severity === "warning" ? "WARNING" : "INFO"}
                </div>
              </div>

              <p className="alert-card__desc">{desc}</p>

              <div className="alert-card__footer">
                <span className="alert-track">{trackId}</span>
                <span className="alert-time">{time}</span>
              </div>
            </ScrollRevealItem>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
