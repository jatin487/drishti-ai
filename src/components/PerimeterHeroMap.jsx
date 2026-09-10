import React, { useState } from "react";
import "./PerimeterHeroMap.css";

const PINS = [
  {
    id: "target",
    name: "INTRUDER TARGET",
    x: 64.5,
    y: 52.0,
    type: "threat",
    label: "DETECTED · 0.94",
    details: {
      classification: "Unidentified Human Figure",
      confidence: "94.2%",
      range: "14m from Perimeter Wire",
      threat: "ELEVATED",
      action: "Autonomous Tracking · Sentry Alerted",
      coords: "32°44′18″ N · 74°52′55″ E",
    },
  },
  {
    id: "CAM-03",
    name: "CAM-03 (RIVERINE GAP)",
    x: 50.2,
    y: 61.5,
    type: "sensor",
    label: "CAM-03 · ACTIVE",
    details: {
      classification: "Optical / Night-Vis PTZ Mast",
      confidence: "100%",
      range: "Sector 07 Coverage",
      threat: "CLEAR",
      action: "Sector Sweep · 24 FPS HEVC",
      coords: "GPS 47°159′ N · 74°52′48″ E",
    },
  },
  {
    id: "CAM-04",
    name: "CAM-04 (EAST FLANK)",
    x: 86.5,
    y: 34.5,
    type: "sensor",
    label: "CAM-04 · PATROL",
    details: {
      classification: "Long-Range Boundary Node",
      confidence: "99.8%",
      range: "Sector 08 Buffer Zone",
      threat: "MONITORED",
      action: "Infrared Pulse Array",
      coords: "GPS 47°3.87′ N · 74°53′12″ E",
    },
  },
  {
    id: "CATAL02",
    name: "CAM-02 (WEST SECTOR)",
    x: 29.0,
    y: 54.0,
    type: "sensor",
    label: "CAM-02 · ONLINE",
    details: {
      classification: "Thermal Sentry Rig",
      confidence: "99.1%",
      range: "Sector 04 Perimeter Wire",
      threat: "NORMAL",
      action: "Thermal Edge Inference",
      coords: "GPS 38°46.27′ N · 74°51′30″ E",
    },
  },
  {
    id: "WATCHTOWER",
    name: "WATCHTOWER DELTA",
    x: 49.5,
    y: 36.0,
    type: "base",
    label: "WATCHTOWER DELTA",
    details: {
      classification: "Elevated Command Post",
      confidence: "OPERATIONAL",
      range: "360° Panoramic Vision",
      threat: "DEFCON 2",
      action: "Tactical Sensor Hub Active",
      coords: "Elevated Mast · Alt 45m",
    },
  },
];

export default function PerimeterHeroMap({ onSelectCamera }) {
  const [activePin, setActivePin] = useState(PINS[0]);
  const [radarSweeping, setRadarSweeping] = useState(true);

  return (
    <div className="perimeter-hero-map">
      {/* Background Hero Banner */}
      <div className="map-canvas-container">
        <img
          src="/hero-border-security.jpg"
          alt="Drishti-X Tactical Border Perimeter"
          className="map-bg-image"
        />

        {/* Dynamic Radar Sweep Layer emanating from CAM-03 */}
        {radarSweeping && (
          <div className="radar-sweep-overlay" style={{ left: "64%", top: "52%" }}>
            <div className="radar-sweep-beam" />
            <div className="radar-sweep-ring r1" />
            <div className="radar-sweep-ring r2" />
          </div>
        )}

        {/* Interactive Hotspot Pins */}
        {PINS.map((pin) => {
          const isSelected = activePin?.id === pin.id;
          return (
            <div
              key={pin.id}
              className={`map-hotspot pin--${pin.type} ${isSelected ? "selected" : ""}`}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              onClick={() => setActivePin(pin)}
              role="button"
              tabIndex={0}
              title={`Click to inspect ${pin.name}`}
            >
              <div className="hotspot-pulse" />
              <div className="hotspot-core" />
              {pin.type === "threat" && (
                <div className="threat-bounding-hud">
                  <div className="threat-tag-hud">{pin.label}</div>
                  <div className="corner-bracket-c tl" />
                  <div className="corner-bracket-c tr" />
                  <div className="corner-bracket-c bl" />
                  <div className="corner-bracket-c br" />
                </div>
              )}
            </div>
          );
        })}

        {/* Light Glass Tactical Status HUD (Top Left) */}
        <div className="map-glass-badge">
          <div className="badge-header">
            <span className="live-pulsing-dot" />
            <span className="badge-title">PERIMETER ARMED</span>
          </div>
          <div className="badge-sub">DEFCON 2 · ELEVATED SURVEILLANCE</div>
        </div>

        {/* Tactical Controls Toolbar (Top Right) */}
        <div className="map-toolbar">
          <button
            className={`map-tool-btn ${radarSweeping ? "active" : ""}`}
            onClick={() => setRadarSweeping(!radarSweeping)}
            title="Toggle Radar Sweep Overlay"
          >
            RADAR: {radarSweeping ? "ON" : "OFF"}
          </button>
        </div>

        {/* Active Pin Detailed Telemetry Card (Bottom Left Floating Glass) */}
        {activePin && (
          <div className="pin-telemetry-card">
            <div className="pin-card-header">
              <span className={`pin-type-pill ${activePin.type}`}>
                {activePin.type === "threat" ? "⚠ TARGET LOCKED" : "● SENSOR NODE"}
              </span>
              <span className="pin-coords mono">{activePin.details.coords}</span>
              <button className="pin-close-btn" onClick={() => setActivePin(null)}>
                ✕
              </button>
            </div>
            <div className="pin-card-title">{activePin.name}</div>
            <div className="pin-card-grid">
              <div className="pin-stat">
                <span className="stat-label">TYPE</span>
                <span className="stat-val">{activePin.details.classification}</span>
              </div>
              <div className="pin-stat">
                <span className="stat-label">CONFIDENCE</span>
                <span className="stat-val text-amber">{activePin.details.confidence}</span>
              </div>
              <div className="pin-stat">
                <span className="stat-label">STATUS</span>
                <span className="stat-val">{activePin.details.action}</span>
              </div>
            </div>

            {onSelectCamera && activePin.id.startsWith("CAM") && (
              <button
                className="pin-action-btn"
                onClick={() => onSelectCamera(activePin.id)}
              >
                Switch To Live Stream ({activePin.id}) →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
