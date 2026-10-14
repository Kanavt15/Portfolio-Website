"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { skillGroups, skillIcon, skillInvert } from "@/lib/data";
import { Eyebrow, Marquee, Reveal, SplitTitle } from "../ui/primitives";

function Logo({ name, size = 22 }) {
  const src = skillIcon(name);
  if (!src) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" width={size} height={size} className={skillInvert(name) ? "invert" : ""} loading="lazy" />;
}

export default function Skills() {
  const [active, setActive] = useState(0);
  const group = skillGroups[active];
  const all = skillGroups.flatMap((g) => g.items).filter((s) => skillIcon(s));
  const half = Math.ceil(all.length / 2);

  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="container">
        <div className="section-head">
          <div>
            <Eyebrow num="04">Toolkit</Eyebrow>
            <SplitTitle id="skills-title">{["Skills that bring", "ideas to *life."]}</SplitTitle>
          </div>
          <Reveal variant="blur" as="p" className="section-lead" delay={0.2}>
            From backend services and database design to interactive 3D and machine learning — the tools and foundations
            behind my work.
          </Reveal>
        </div>

        <div className="skills-layout">
          <Reveal variant="left" className="skill-tabs" role="tablist" aria-label="Skill categories">
            {skillGroups.map((g, i) => (
              <button
                key={g.name}
                role="tab"
                aria-selected={active === i}
                className={`skill-tab${active === i ? " active" : ""}`}
                onClick={() => setActive(i)}
                onPointerEnter={() => setActive(i)}
              >
                {active === i && (
                  <motion.span
                    layoutId="skill-tab"
                    className="skill-tab-bg"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                {g.name}
                <small>{String(g.items.length).padStart(2, "0")}</small>
              </button>
            ))}
          </Reveal>

          <Reveal variant="scale" className="card skill-panel" role="tabpanel" delay={0.1}>
            <div className="skill-panel-head">
              <AnimatePresence mode="wait">
                <motion.h3
                  key={group.name}
                  initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                  transition={{ duration: 0.3 }}
                >
                  {group.name}
                </motion.h3>
              </AnimatePresence>
              <span className="eyebrow">
                {String(active + 1).padStart(2, "0")} / {String(skillGroups.length).padStart(2, "0")}
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.ul key={group.name} className="skill-grid" initial="hidden" animate="show" exit="exit">
                {group.items.map((s, i) => (
                  <motion.li
                    key={s}
                    className="skill-item"
                    variants={{
                      hidden: { opacity: 0, y: 24, scale: 0.85, rotate: -4 },
                      show: { opacity: 1, y: 0, scale: 1, rotate: 0 },
                      exit: { opacity: 0, y: -12, scale: 0.95 },
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 24, delay: i * 0.045 }}
                    whileHover={{ y: -4 }}
                  >
                    <motion.span className="logo" whileHover={{ rotate: 360 }} transition={{ duration: 0.7 }}>
                      {skillIcon(s) ? <Logo name={s} /> : <span style={{ color: "var(--accent)" }}>✦</span>}
                    </motion.span>
                    {s}
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </Reveal>
        </div>

        <div className="skill-icons-band" aria-hidden="true">
          <Marquee duration={50}>
            {all.slice(0, half).map((s) => (
              <span className="icon-pill" key={s}>
                <Logo name={s} size={20} /> {s}
              </span>
            ))}
          </Marquee>
          <Marquee duration={55} reverse>
            {all.slice(half).map((s) => (
              <span className="icon-pill" key={s}>
                <Logo name={s} size={20} /> {s}
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
