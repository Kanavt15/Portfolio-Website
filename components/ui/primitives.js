"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "motion/react";

const ease = [0.22, 1, 0.36, 1];

/* Section title: each word slides up from behind a mask, staggered. */
export function SplitTitle({ children, className = "section-title", as = "h2", id, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const Tag = motion[as];
  const lines = Array.isArray(children) ? children : [children];
  let i = 0;
  return (
    <Tag ref={ref} id={id} className={className}>
      {lines.map((line, li) => (
        <span key={li} style={{ display: "block" }}>
          {String(line)
            .split(" ")
            .map((word, wi) => {
              const idx = i++;
              const gradient = word.startsWith("*");
              const clean = gradient ? word.slice(1) : word;
              return (
                <span className="word-wrap" key={wi}>
                  <motion.span
                    className={`word${gradient ? " gradient-text" : ""}`}
                    initial={{ y: "110%", rotate: 4 }}
                    animate={inView ? { y: "0%", rotate: 0 } : {}}
                    transition={{ duration: 0.9, ease, delay: delay + idx * 0.06 }}
                  >
                    {clean}
                  </motion.span>
                  {"\u00a0"}
                </span>
              );
            })}
        </span>
      ))}
    </Tag>
  );
}

/* Eyebrow: number + line that draws in + label typed out. */
export function Eyebrow({ num, children }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <div ref={ref} className="eyebrow">
      <span className="num">{num}</span>
      <motion.span
        className="line"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        style={{ originX: 0 }}
        transition={{ duration: 0.8, ease }}
      />
      <motion.span
        initial={{ opacity: 0, x: -8 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease, delay: 0.3 }}
      >
        {children}
      </motion.span>
    </div>
  );
}

/* Generic reveal with selectable variant. */
const variants = {
  up: { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } },
  blur: { hidden: { opacity: 0, filter: "blur(12px)", y: 12 }, show: { opacity: 1, filter: "blur(0px)", y: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.92 }, show: { opacity: 1, scale: 1 } },
  left: { hidden: { opacity: 0, x: -60 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 60 }, show: { opacity: 1, x: 0 } },
  clip: {
    hidden: { opacity: 0, clipPath: "inset(0 0 100% 0 round 20px)" },
    show: { opacity: 1, clipPath: "inset(0 0 0% 0 round 20px)" },
  },
  flip: { hidden: { opacity: 0, rotateX: -35, y: 40 }, show: { opacity: 1, rotateX: 0, y: 0 } },
};
export function Reveal({ children, variant = "up", delay = 0, duration = 0.9, className, style, as = "div", ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      style={style}
      variants={variants[variant]}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration, ease, delay }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* Number ticker (Magic UI style): springs from 0 to value when visible. */
export function NumberTicker({ value, decimals = 0, plain = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const from = plain ? Math.max(0, value - 40) : 0;
    const controls = animate(from, value, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = v.toFixed(decimals);
      },
    });
    return () => controls.stop();
  }, [inView, value, decimals, plain]);
  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {(plain ? value - 40 : 0).toFixed(decimals)}
    </span>
  );
}

/* Magnetic wrapper: element is pulled toward the pointer. */
export function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 200, damping: 15, mass: 0.3 });
  const y = useSpring(0, { stiffness: 200, damping: 15, mass: 0.3 });
  function move(e) {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function leave() {
    x.set(0);
    y.set(0);
  }
  return (
    <motion.div ref={ref} onPointerMove={move} onPointerLeave={leave} style={{ x, y, display: "inline-flex" }}>
      {children}
    </motion.div>
  );
}

/* Card whose border + background light follows the cursor. */
export function SpotlightCard({ children, className = "", as = "div", ...rest }) {
  const Tag = as;
  function move(e) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  }
  return (
    <Tag className={`card spotlight-card ${className}`} onPointerMove={move} {...rest}>
      {children}
    </Tag>
  );
}

/* 3D tilt card with glare. */
export function TiltCard({ children, className = "", max = 10, ...rest }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18 });
  function move(e) {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  }
  function leave() {
    rx.set(0);
    ry.set(0);
  }
  return (
    <motion.a
      className={`card spotlight-card ${className}`}
      onPointerMove={move}
      onPointerLeave={leave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000 }}
      {...rest}
    >
      {children}
    </motion.a>
  );
}

/* Infinite marquee (CSS-driven, duplicated track). */
export function Marquee({ children, reverse = false, duration = 40, className = "" }) {
  return (
    <div className={`marquee ${reverse ? "reverse" : ""} ${className}`} style={{ "--duration": `${duration}s` }}>
      {[0, 1].map((k) => (
        <div className="marquee-track" key={k} aria-hidden={k === 1}>
          {children}
        </div>
      ))}
    </div>
  );
}

/* Rotating words with a vertical blur slide. */
export function WordRotate({ words, interval = 2400 }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);
  return (
    <span className="word-rotate">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[i]}
          initial={{ y: "100%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.5, ease }}
          className="gradient-text"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* Scroll-linked word opacity reveal (text "lights up" as you read). */
export function ScrollRevealText({ text, highlight = [], progress }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <RevealWord key={i} progress={progress} range={[start, end]} hl={highlight.includes(w.replace(/[.,]/g, ""))}>
            {w}
          </RevealWord>
        );
      })}
    </>
  );
}
function RevealWord({ children, progress, range, hl }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span className={`reveal-word${hl ? " hl" : ""}`} style={{ opacity }}>
      {children}
    </motion.span>
  );
}

export { ease };
