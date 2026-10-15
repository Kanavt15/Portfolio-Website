"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState("");
  const [down, setDown] = useState(false);
  const [angle, setAngle] = useState(0);

  // Mouse coords
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth position for the pointer
  const x = useSpring(mouseX, { stiffness: 650, damping: 42, mass: 0.15 });
  const y = useSpring(mouseY, { stiffness: 650, damping: 42, mass: 0.15 });

  // Trailing ghost/reticle position with lag
  const tx = useSpring(mouseX, { stiffness: 220, damping: 25, mass: 0.4 });
  const ty = useSpring(mouseY, { stiffness: 220, damping: 25, mass: 0.4 });

  // Speed-based dynamic scale
  const prevPos = useRef({ x: 0, y: 0, time: Date.now() });
  const speed = useMotionValue(0);
  const smoothSpeed = useSpring(speed, { stiffness: 200, damping: 25 });
  const stretch = useTransform(smoothSpeed, [0, 45], [1, 1.25]);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.body.classList.add("has-cursor");

    let lastTime = Date.now();

    const move = (e) => {
      const cx = e.clientX;
      const cy = e.clientY;
      const now = Date.now();
      const dt = Math.max(1, now - lastTime);

      const dx = cx - prevPos.current.x;
      const dy = cy - prevPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Compute cursor velocity and tilt angle
      speed.set(Math.min(dist / (dt / 16), 50));
      if (dist > 3) {
        const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
        // Dampen rotation transition
        setAngle(deg + 90);
      }

      prevPos.current = { x: cx, y: cy, time: now };
      lastTime = now;

      mouseX.set(cx);
      mouseY.set(cy);

      const target = e.target.closest?.("a, button, [data-cursor], input, [role='button'], summary");
      setHover(!!target);
      setLabel(target?.dataset?.cursor || "");
    };

    const d = () => setDown(true);
    const u = () => setDown(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", d);
    window.addEventListener("pointerup", u);

    return () => {
      document.body.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", d);
      window.removeEventListener("pointerup", u);
    };
  }, [mouseX, mouseY, speed]);

  if (!enabled) return null;

  return (
    <>
      {/* 1. Trailing HUD Crosshair / Bracket Frame */}
      <motion.div
        className="cursor-hud"
        style={{
          x: tx,
          y: ty,
        }}
        animate={{
          scale: down ? 0.8 : hover ? 1.55 : 1,
          opacity: down ? 0.3 : hover ? 0.9 : 0.45,
          rotate: hover ? 45 : 0,
        }}
        transition={{
          scale: { type: "spring", stiffness: 350, damping: 25 },
          rotate: { type: "spring", stiffness: 300, damping: 20 },
        }}
      >
        <span className="bracket tl" />
        <span className="bracket tr" />
        <span className="bracket bl" />
        <span className="bracket br" />
      </motion.div>

      {/* 2. Main Sleek Pointer (Precision Needle / Diamond Dart) */}
      <motion.div
        className="cursor-arrow-wrap"
        style={{
          x,
          y,
          scaleY: stretch,
        }}
      >
        <motion.div
          className="cursor-dart"
          animate={{
            rotate: hover ? 0 : angle,
            scale: down ? 0.75 : hover ? 1.25 : 1,
          }}
          transition={{
            rotate: { type: "spring", stiffness: 320, damping: 28 },
            scale: { type: "spring", stiffness: 450, damping: 22 },
          }}
        >
          {/* Futuristic faceted chevron/dart SVG */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="cursor-svg">
            <defs>
              <linearGradient id="cursorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffb088" />
                <stop offset="60%" stopColor="#ff7a45" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
              <filter id="cursorGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="2.5" floodColor="#ff7a45" floodOpacity="0.65" />
              </filter>
            </defs>

            {hover ? (
              // Cyber Crosshair diamond on hover
              <g filter="url(#cursorGlow)">
                <path
                  d="M12 2 L15 9 L22 12 L15 15 L12 22 L9 15 L2 12 L9 9 Z"
                  fill="url(#cursorGrad)"
                  stroke="#fff"
                  strokeWidth="0.8"
                />
                <circle cx="12" cy="12" r="2.2" fill="#fff" />
              </g>
            ) : (
              // Aerodynamic faceted Dart/Arrow
              <g filter="url(#cursorGlow)">
                {/* Main body */}
                <path
                  d="M12 1.5 L19.5 21 L12 16.5 L4.5 21 Z"
                  fill="url(#cursorGrad)"
                  stroke="#ffffff"
                  strokeWidth="0.75"
                  strokeLinejoin="round"
                />
                {/* Left facet shading */}
                <path
                  d="M12 1.5 L4.5 21 L12 16.5 Z"
                  fill="rgba(0, 0, 0, 0.22)"
                />
                {/* Center ridge glow line */}
                <line x1="12" y1="2.5" x2="12" y2="16" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity="0.9" />
              </g>
            )}
          </svg>
        </motion.div>
      </motion.div>

      {/* 3. Floating Interactive Action Pill Tag */}
      <AnimatePresence>
        {label && (
          <motion.div
            className="cursor-tag"
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0.6, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 24 }}
          >
            <span className="cursor-tag-pulse" />
            <span className="cursor-tag-text">{label}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
