"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

const ease = [0.22, 1, 0.36, 1];

const orbitIcons = [
  "python", "pytorch", "react", "nodejs", "threejs", "tensorflow", "docker", "nextjs",
];
const invert = new Set(["threejs", "nextjs"]);

const code = [
  [{ c: "kw", t: "const " }, { c: "var", t: "kanav" }, { c: "p", t: " = {" }],
  [{ c: "key", t: "  role" }, { c: "p", t: ": " }, { c: "str", t: '"Developer & ML Engineer"' }, { c: "p", t: "," }],
  [{ c: "key", t: "  based" }, { c: "p", t: ": " }, { c: "str", t: '"Mumbai, IN"' }, { c: "p", t: "," }],
  [{ c: "key", t: "  stack" }, { c: "p", t: ": [" }, { c: "str", t: '"PyTorch"' }, { c: "p", t: ", " }, { c: "str", t: '"Node"' }, { c: "p", t: ", " }, { c: "str", t: '"Three.js"' }, { c: "p", t: "]," }],
  [{ c: "key", t: "  cgpa" }, { c: "p", t: ": " }, { c: "num", t: "9.07" }, { c: "p", t: "," }],
  [{ c: "key", t: "  shipping" }, { c: "p", t: ": " }, { c: "kw", t: "true" }],
  [{ c: "p", t: "};" }],
];
const total = code.reduce((n, l) => n + l.reduce((m, s) => m + s.t.length, 0), 0);

/* Typewriter terminal that types the code once, then blinks a cursor. */
function Terminal({ start }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    let i = 0;
    const t = setInterval(() => {
      i += 2;
      setN(Math.min(i, total));
      if (i >= total) clearInterval(t);
    }, 22);
    return () => clearInterval(t);
  }, [start]);

  let left = n;
  return (
    <pre className="hv-code">
      {code.map((line, li) => {
        if (left <= 0 && li > 0) return null;
        return (
          <div key={li}>
            <span className="ln">{li + 1}</span>
            {line.map((s, si) => {
              if (left <= 0) return null;
              const shown = s.t.slice(0, left);
              left -= s.t.length;
              return (
                <span key={si} className={`tk-${s.c}`}>
                  {shown}
                </span>
              );
            })}
            {(left <= 0 || li === code.length - 1) && <span className="caret" />}
          </div>
        );
      })}
    </pre>
  );
}

export default function HeroVisual({ loaded }) {
  // Whole visual tilts subtly toward the pointer.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [8, -8]), { stiffness: 120, damping: 20 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-10, 10]), { stiffness: 120, damping: 20 });
  const floatX = useSpring(useTransform(mx, [-1, 1], [-14, 14]), { stiffness: 80, damping: 20 });
  const floatY = useSpring(useTransform(my, [-1, 1], [-14, 14]), { stiffness: 80, damping: 20 });

  useEffect(() => {
    const move = (e) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [mx, my]);

  return (
    <motion.div
      className="hero-visual"
      aria-hidden="true"
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      initial={{ opacity: 0, scale: 0.85, filter: "blur(16px)" }}
      animate={loaded ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
      transition={{ duration: 1.4, ease, delay: 0.6 }}
    >
      {/* Orbit rings with tech logos */}
      <motion.div
        className="hv-orbit hv-orbit-outer"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {orbitIcons.map((icon, i) => {
          const a = (i / orbitIcons.length) * Math.PI * 2;
          return (
            <motion.span
              key={icon}
              className="hv-logo"
              style={{ left: `${50 + Math.cos(a) * 50}%`, top: `${50 + Math.sin(a) * 50}%` }}
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              whileHover={{ scale: 1.3 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/skill-icons/${icon}.svg`} alt="" className={invert.has(icon) ? "invert" : ""} />
            </motion.span>
          );
        })}
      </motion.div>
      <motion.div
        className="hv-orbit hv-orbit-inner"
        animate={{ rotate: -360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        <span className="hv-spark" />
      </motion.div>
      <div className="hv-core" />

      {/* Terminal card */}
      <motion.div
        className="hv-terminal"
        style={{ x: floatX, y: floatY }}
        initial={{ y: 40, opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ duration: 1, ease, delay: 1 }}
      >
        <div className="hv-bar">
          <i /> <i /> <i />
          <span>kanav.config.js</span>
        </div>
        <Terminal start={loaded} />
      </motion.div>

      {/* Floating badges */}
      <motion.div
        className="hv-badge hv-badge-a"
        initial={{ opacity: 0, x: -30 }}
        animate={loaded ? { opacity: 1, x: 0, y: [0, -10, 0] } : {}}
        transition={{ opacity: { delay: 1.6 }, x: { delay: 1.6, duration: 0.8, ease }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
      >
        <span className="hv-badge-icon">🏆</span>
        <span>
          <b>3rd Prize</b>
          <small>Tantragyan 2026</small>
        </span>
      </motion.div>
      <motion.div
        className="hv-badge hv-badge-b"
        initial={{ opacity: 0, x: 30 }}
        animate={loaded ? { opacity: 1, x: 0, y: [0, 12, 0] } : {}}
        transition={{ opacity: { delay: 1.8 }, x: { delay: 1.8, duration: 0.8, ease }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
      >
        <span className="hv-ring">
          <svg viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" />
            <motion.circle
              cx="18"
              cy="18"
              r="15"
              initial={{ pathLength: 0 }}
              animate={loaded ? { pathLength: 0.85 } : {}}
              transition={{ duration: 2, ease, delay: 2 }}
            />
          </svg>
        </span>
        <span>
          <b>85% accuracy</b>
          <small>CIFAR-100 CNN</small>
        </span>
      </motion.div>
      <motion.div
        className="hv-badge hv-badge-c"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={loaded ? { opacity: 1, scale: 1, y: [0, -8, 0] } : {}}
        transition={{ opacity: { delay: 2 }, scale: { delay: 2, type: "spring", stiffness: 300, damping: 15 }, y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" } }}
      >
        <span className="hv-bars">
          {[0.5, 0.8, 0.4, 1, 0.7].map((h, i) => (
            <motion.i
              key={i}
              animate={{ scaleY: [h, h * 0.4 + 0.3, h] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
            />
          ))}
        </span>
        <span>
          <b>5 projects</b>
          <small>3D · ML · Full-stack</small>
        </span>
      </motion.div>
    </motion.div>
  );
}
