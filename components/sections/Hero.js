"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { profile } from "@/lib/data";
import { useShell } from "../shell/AppShell";
import { Magnetic, WordRotate } from "../ui/primitives";
import { ArrowRight, ArrowUpRight } from "../ui/icons";

const ease = [0.22, 1, 0.36, 1];

function Chars({ text, start, loaded, className = "" }) {
  return text.split("").map((c, i) => (
    <motion.span
      key={i}
      className={`char ${className}`}
      initial={{ y: "115%", rotateX: -80, opacity: 0 }}
      animate={loaded ? { y: "0%", rotateX: 0, opacity: 1 } : {}}
      transition={{ duration: 1.1, ease, delay: start + i * 0.045 }}
      whileHover={{ y: "-12%", transition: { type: "spring", stiffness: 400, damping: 12 } }}
    >
      {c}
    </motion.span>
  ));
}

const beams = [
  { left: "12%", delay: 0, duration: 7 },
  { left: "31%", delay: 2.5, duration: 9 },
  { left: "58%", delay: 1.2, duration: 6.5 },
  { left: "79%", delay: 4, duration: 8 },
  { left: "92%", delay: 3, duration: 10 },
];

export default function Hero() {
  const { loaded } = useShell();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  function onMove(e) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  const fade = (d) => ({
    initial: { opacity: 0, y: 24, filter: "blur(10px)" },
    animate: loaded ? { opacity: 1, y: 0, filter: "blur(0px)" } : {},
    transition: { duration: 1, ease, delay: d },
  });

  return (
    <section id="home" ref={ref} className="hero" onPointerMove={onMove} aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-spotlight" aria-hidden="true" />
      {beams.map((b, i) => (
        <motion.span
          key={i}
          className="hero-beam"
          style={{ left: b.left }}
          initial={{ y: "-20vh", opacity: 0 }}
          animate={loaded ? { y: ["-20vh", "110vh"], opacity: [0, 1, 1, 0] } : {}}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: "linear" }}
          aria-hidden="true"
        />
      ))}

      <motion.div className="container" style={{ y, opacity, scale }}>
        <motion.div className="hero-badge" {...fade(0.1)}>
          <span className="pulse">
            <i /> Available
          </span>
          Open to internships & full-time roles · Class of 2027
        </motion.div>

        <h1 id="hero-title" className="hero-title" style={{ perspective: 800 }}>
          <span className="row">
            <Chars text={profile.first} start={0.2} loaded={loaded} />
          </span>
          <span className="row">
            <Chars text={profile.last} start={0.45} loaded={loaded} className="outline" />
            <motion.span
              className="char gradient-text"
              initial={{ scale: 0, opacity: 0 }}
              animate={loaded ? { scale: 1, opacity: 1 } : {}}
              transition={{ type: "spring", stiffness: 300, damping: 12, delay: 1.1 }}
            >
              .
            </motion.span>
          </span>
        </h1>

        <div className="hero-bottom">
          <motion.p className="hero-sub" {...fade(0.9)}>
            <strong>Developer &amp; ML engineer</strong> in Mumbai, crafting <br />
            <WordRotate words={profile.roles} />
            <br />
            with curiosity and care.
          </motion.p>
          <motion.div className="hero-actions" {...fade(1.05)}>
            <Magnetic>
              <a href="#projects" className="btn btn-shimmer" data-cursor="Work">
                <span className="btn-shimmer-inner">
                  View my work <ArrowRight />
                </span>
              </a>
            </Magnetic>
            <Magnetic>
              <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn-primary">
                Résumé <ArrowUpRight />
              </a>
            </Magnetic>
          </motion.div>
        </div>

        <motion.div className="hero-meta" {...fade(1.2)}>
          <span>◎ {profile.location}</span>
          <span className="hide-sm">Computer Engineering · Honors in AI &amp; ML</span>
          <a href="#about" className="scroll-cue" aria-label="Scroll to about">
            <span className="mouse">
              <motion.i animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
            </span>
            Scroll
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
