import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "#console",       label: "Live Console" },
  { href: "#perimeter",     label: "Perimeter Map" },
  { href: "#capabilities",  label: "Capabilities" },
  { href: "#pipeline",      label: "AI Pipeline" },
  { href: "#network",       label: "Outposts" },
  { href: "#alerts",        label: "Alerts" },
];

/* Clamp + lerp helpers */
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const lerp = (a, b, t) => a + (b - a) * t;

export default function Nav() {
  const [isPaused, setIsPaused] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const navRef = useRef(null);
  const rafRef = useRef(null);

  /* ── Smooth scroll-linked glassmorphism fade ── */
  const updateNavStyle = useCallback(() => {
    const y = window.scrollY;
    const p = clamp(y / 200, 0, 1);
    setScrollProgress(p);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateNavStyle);
    };

    updateNavStyle();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateNavStyle]);

  /* Close mobile menu on resize to desktop */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ── Smooth anchor scrolling ── */
  const handleAnchorClick = useCallback((e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Duplicate links for seamless infinite marquee
  const marqueeLinks = [...NAV_LINKS, ...NAV_LINKS, ...NAV_LINKS];

  /* ── Compute dynamic inline styles from scroll progress ── */
  const p = scrollProgress;
  const bgAlpha    = lerp(0.25, 0.92, p).toFixed(3);
  const blurVal    = lerp(8, 32, p).toFixed(1);
  const saturateV  = lerp(1.1, 1.8, p).toFixed(2);
  const borderA    = lerp(0.05, 0.40, p).toFixed(3);
  const shadowA    = lerp(0.08, 0.50, p).toFixed(3);
  const glowA      = lerp(0.0, 0.20, p).toFixed(3);
  const padY       = lerp(0.85, 0.55, p).toFixed(3);
  const glowLineOp = lerp(0, 1, p).toFixed(3);

  const navInlineStyle = {
    background: `rgba(10, 14, 20, ${bgAlpha})`,
    backdropFilter: `blur(${blurVal}px) saturate(${saturateV})`,
    WebkitBackdropFilter: `blur(${blurVal}px) saturate(${saturateV})`,
    borderBottom: `1px solid rgba(194, 121, 12, ${borderA})`,
    boxShadow: `0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 32px rgba(0,0,0,${shadowA}), 0 1px 0 rgba(194,121,12,${glowA})`,
    padding: `${padY}rem 1.85rem`,
  };

  const glowLineStyle = {
    position: "absolute",
    bottom: "-1px",
    left: 0,
    right: 0,
    height: "2px",
    background: `linear-gradient(90deg, transparent 0%, rgba(194,121,12,0.6) 20%, rgba(245,158,11,0.85) 50%, rgba(194,121,12,0.6) 80%, transparent 100%)`,
    opacity: glowLineOp,
    pointerEvents: "none",
    transition: "opacity 0.15s ease",
  };

  return (
    <>
      <header
        ref={navRef}
        className="top-nav"
        style={navInlineStyle}
      >
        {/* Amber glow line at bottom */}
        <div style={glowLineStyle} />

        {/* Brand */}
        <div className="top-nav__brand">
          <div className="brand-logo-mark">
            <span className="brand-dot" />
            <span className="brand-ring" />
          </div>
          <div className="brand-text">
            <span className="brand-title">
              DRISHTI-<span className="brand-x">X</span>
            </span>
          </div>
        </div>

        {/* ── Scrolling Marquee Nav (desktop only) ── */}
        <div
          className="top-nav__marquee-wrap top-nav__marquee-wrap--desktop"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="top-nav__marquee-track"
            style={{ animationPlayState: isPaused ? "paused" : "running" }}
          >
            {marqueeLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="marquee-nav-link"
                onClick={(e) => handleAnchorClick(e, link.href)}
              >
                <span className="marquee-nav-dot" />
                {link.label}
              </a>
            ))}
          </div>
          {/* Gradient fade edges */}
          <div className="marquee-fade-left" />
          <div className="marquee-fade-right" />
        </div>

        {/* Actions */}
        <div className="top-nav__actions">
          <motion.a
            href="http://localhost:5001/login"
            className="nav-btn nav-btn--primary"
            whileHover={shouldReduceMotion ? {} : { y: -2 }}
            transition={{ duration: 0.15 }}
          >
            <span className="nav-btn-label">Access Dashboard</span>
            <motion.span
              className="nav-arrow"
              whileHover={shouldReduceMotion ? {} : { x: 4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              ↗
            </motion.span>
          </motion.a>

          {/* Hamburger button — mobile only */}
          <button
            className={`nav-hamburger${mobileOpen ? " nav-hamburger--open" : ""}`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-nav-drawer"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <nav className="mobile-nav-links">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="mobile-nav-link"
                  onClick={(e) => handleAnchorClick(e, link.href)}
                >
                  <span className="mobile-nav-dot" />
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
