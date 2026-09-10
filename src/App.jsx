import React, { useState, useEffect, useRef } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import PerimeterSection from "./components/PerimeterSection";
import CapabilityGrid from "./components/CapabilityGrid";
import PipelineFlow from "./components/PipelineFlow";
import OutpostMap from "./components/OutpostMap";
import AlertFeed from "./components/AlertFeed";
import ImpactStats from "./components/ImpactStats";
import FinalCTA from "./components/FinalCTA";
import "./App.css";

const CAMERAS = [
  { id: "CAM-01", name: "OUTPOST BRAVO", sector: "SECTOR 04 · PERIMETER WIRE", status: "ONLINE", threat: "CRITICAL", filter: "optical" },
  { id: "CAM-02", name: "WATCHTOWER DELTA", sector: "SECTOR 02 · ELEVATED MAST", status: "ONLINE", threat: "MONITORED", filter: "thermal" },
  { id: "CAM-03", name: "OUTPOST ECHO", sector: "SECTOR 07 · RIVERINE GAP", status: "ONLINE", threat: "CLEAR", filter: "nvg" },
  { id: "CAM-04", name: "UAV FALCON-02", sector: "AERIAL RECON · ALT 240M", status: "PATROL", threat: "SCANNING", filter: "optical" },
];

const FILTERS = ["optical", "thermal", "nvg"];
const FILTER_LABELS = { optical: "OPTICAL", thermal: "THERMAL", nvg: "NIGHT-VIS" };

export default function App() {
  const [activeCam, setActiveCam] = useState(CAMERAS[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showAiOverlay, setShowAiOverlay] = useState(true);
  const [visionMode, setVisionMode] = useState("optical");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoCycle, setAutoCycle] = useState(true);
  const [snapshotToast, setSnapshotToast] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const videoRef = useRef(null);
  const cycleRef = useRef(null);

  // Live real-time tactical clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      const timeStr = `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())} ${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())} UTC`;
      setCurrentTime(timeStr);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-cycle filters every 2 seconds with smooth fade
  useEffect(() => {
    if (!autoCycle) return;
    cycleRef.current = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setVisionMode((prev) => {
          const idx = FILTERS.indexOf(prev);
          return FILTERS[(idx + 1) % FILTERS.length];
        });
        setIsTransitioning(false);
      }, 400);
    }, 2000);
    return () => clearInterval(cycleRef.current);
  }, [autoCycle]);

  const handleFilterClick = (mode) => {
    setAutoCycle(false);
    clearInterval(cycleRef.current);
    setIsTransitioning(true);
    setTimeout(() => {
      setVisionMode(mode);
      setIsTransitioning(false);
    }, 300);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const captureSnapshot = () => {
    setSnapshotToast(`Forensic snapshot captured from ${activeCam.id} · Timestamp: ${currentTime}`);
    setTimeout(() => setSnapshotToast(null), 3500);
  };

  return (
    <div className="page">
      {/* ── Top Tactical Navigation Bar ── */}
      <Nav />

      {/* ── Hero Section (Side-by-Side Landing Page) ── */}
      <Hero
        activeCam={activeCam}
        cameras={CAMERAS}
        onSelectCamera={setActiveCam}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        showAiOverlay={showAiOverlay}
        setShowAiOverlay={setShowAiOverlay}
        visionMode={visionMode}
        filterLabels={FILTER_LABELS}
        filters={FILTERS}
        handleFilterClick={handleFilterClick}
        autoCycle={autoCycle}
        setAutoCycle={setAutoCycle}
        captureSnapshot={captureSnapshot}
        currentTime={currentTime}
        videoRef={videoRef}
        isTransitioning={isTransitioning}
      />
      {/* ── Toast Notification ── */}
      {snapshotToast && (
        <div className="snapshot-toast">
          <span className="toast-icon">✔</span>
          <span className="toast-msg">{snapshotToast}</span>
        </div>
      )}

      {/* ════════════════════════════════════════
          PAGE SECTIONS (in scrolling order)
          ════════════════════════════════════════ */}

      {/* ── Dedicated Perimeter Surveillance Section (Scrolling flow) ── */}
      <PerimeterSection />

      <CapabilityGrid />
      <PipelineFlow />
      <OutpostMap />
      <AlertFeed />
      <ImpactStats />
      <FinalCTA />

    </div>
  );
}
