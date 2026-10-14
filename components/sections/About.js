"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll } from "motion/react";
import { profile, stats } from "@/lib/data";
import { Eyebrow, Marquee, NumberTicker, Reveal, ScrollRevealText, SplitTitle, SpotlightCard } from "../ui/primitives";
import { ArrowUpRight, Briefcase, Calendar, GradCap, Layers, Sparkle } from "../ui/icons";

const statIcons = [<Sparkle key="a" />, <Calendar key="b" />, <Briefcase key="c" />, <Layers key="d" />];

export function MarqueeBand() {
  const words = ["Backend systems", "Machine learning", "Computer vision", "Interactive 3D", "REST APIs", "Full-stack"];
  return (
    <div className="marquee-band" aria-hidden="true">
      <Marquee duration={36}>
        {words.map((w) => (
          <span className="marquee-word" key={w}>
            {w} <span className="star">✦</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}

function MumbaiClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(new Date());
    setTime(fmt());
    const t = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(t);
  }, []);
  return <div className="clock">{time || "—"} IST</div>;
}

function DegreeProgress() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref}>
      <div className="progress-track">
        <motion.span
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 0.75 } : {}}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        />
      </div>
      <div className="progress-meta">
        <span>Sem I</span>
        <span>Sem VI · now</span>
        <span>2027</span>
      </div>
    </div>
  );
}

export default function About() {
  const introRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: introRef, offset: ["start 85%", "end 45%"] });

  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container">
        <div className="section-head">
          <div>
            <Eyebrow num="01">About me</Eyebrow>
            <SplitTitle id="about-title">{["Good to have", "you *here."]}</SplitTitle>
          </div>
        </div>

        <div className="bento">
          <Reveal variant="clip" className="bento-intro card spotlight-card" duration={1.1}>
            <p ref={introRef}>
              <ScrollRevealText
                progress={scrollYProgress}
                highlight={["curious", "builder", "AI", "ML", "backend", "machine", "learning", "better"]}
                text="I’m Kanav — a curious mind, a hands-on builder, and a Computer Engineering student with Honors in AI & ML. My work moves between backend systems, REST APIs, computer vision and machine learning pipelines. I like understanding how things work, then making them work a little better."
              />
            </p>
            <div className="foot">
              <span>Studying at K. J. Somaiya Institute of Technology, Mumbai.</span>
              <a className="btn btn-ghost" href={profile.resume} target="_blank" rel="noreferrer" style={{ height: 44 }}>
                The story on paper <ArrowUpRight size={16} />
              </a>
            </div>
          </Reveal>

          {stats.slice(0, 2).map((s, i) => (
            <Reveal key={s.label} variant="scale" delay={0.1 + i * 0.1} className="bento-stat card spotlight-card">
              <span className="icon">{statIcons[i]}</span>
              <div>
                <div className="value">
                  <NumberTicker value={s.value} decimals={s.decimals} plain={s.plain} />
                  {s.suffix && <small>{s.suffix}</small>}
                </div>
                <div className="label">{s.label}</div>
              </div>
            </Reveal>
          ))}

          <Reveal variant="left" className="bento-edu card spotlight-card">
            <div className="edu-row">
              <span className="icon-box">
                <GradCap />
              </span>
              <span className="badge">B.E. · Honors AIML</span>
            </div>
            <span className="tagline">Education</span>
            <h3>K. J. Somaiya Institute of Technology</h3>
            <p className="muted">Computer Engineering · Graduating 2027</p>
            <DegreeProgress />
          </Reveal>

          <Reveal variant="right" className="bento-loc card spotlight-card">
            <span className="tagline">Based in</span>
            <h3 style={{ marginTop: 8 }}>Mumbai, India</h3>
            <MumbaiClock />
            <p className="muted" style={{ maxWidth: 220, marginTop: "auto" }}>
              Happy to collaborate remotely across time zones.
            </p>
            <div className="globe-wrap" aria-hidden="true">
              <motion.div className="orbit" animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }}>
                <span className="orbit-dot" />
              </motion.div>
              <motion.div className="orbit" animate={{ rotate: -360 }} transition={{ duration: 16, repeat: Infinity, ease: "linear" }}>
                <span className="orbit-dot" style={{ background: "var(--accent)", boxShadow: "0 0 12px var(--accent)" }} />
              </motion.div>
              <div className="orbit" />
              <motion.span className="loc-pin" animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 2, repeat: Infinity }} />
            </div>
          </Reveal>

          {stats.slice(2).map((s, i) => (
            <Reveal key={s.label} variant="flip" delay={i * 0.1} className="bento-small bento-stat card spotlight-card">
              <span className="icon">{statIcons[i + 2]}</span>
              <div>
                <div className="value">
                  <NumberTicker value={s.value} decimals={s.decimals} />
                  {s.suffix && <small>{s.suffix}</small>}
                </div>
                <div className="label">{s.label}</div>
              </div>
            </Reveal>
          ))}

          <Reveal variant="blur" delay={0.2} className="bento-small card spotlight-card">
            <span className="tagline">Currently exploring</span>
            <h3>3D CNNs, medical imaging &amp; WebGL</h3>
            <p className="muted">Where ML research meets things you can touch.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
