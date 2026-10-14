"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { experience } from "@/lib/data";
import { Eyebrow, NumberTicker, Reveal, SplitTitle } from "../ui/primitives";

function ExpCard({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal variant={index % 2 ? "right" : "left"} className="timeline-item" delay={0.05}>
      <motion.span
        className="timeline-node"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-30% 0px" }}
        transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.3 }}
      >
        <i />
      </motion.span>
      <div
        className="card spotlight-card exp-card"
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
          e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
        }}
      >
        <div>
          <span className="exp-date">{item.date}</span>
          <h3>{item.company}</h3>
          <span className="exp-role">{item.role}</span>
          <p>{item.summary}</p>
          <AnimatePresence initial={false}>
            {open && (
              <motion.p
                key="more"
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: "hidden" }}
              >
                {item.detail}
              </motion.p>
            )}
          </AnimatePresence>
          <button className="exp-more" onClick={() => setOpen(!open)} aria-expanded={open}>
            <motion.span className="plus" animate={{ rotate: open ? 45 : 0 }}>
              +
            </motion.span>
            {open ? "Show less" : "More about the role"}
          </button>
          <div className="chips">
            {item.tags.map((t, i) => (
              <motion.span
                key={t}
                className="chip"
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.4 + i * 0.06 }}
              >
                {t}
              </motion.span>
            ))}
          </div>
        </div>
        <div className="exp-metric">
          <div className="value gradient-text">
            <NumberTicker value={item.metric.value} />
            {item.metric.suffix}
          </div>
          <div className="label">{item.metric.label}</div>
        </div>
      </div>
    </Reveal>
  );
}

export default function Experience() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <div className="container">
        <div className="section-head">
          <div>
            <Eyebrow num="02">Experience</Eyebrow>
            <SplitTitle id="experience-title">{["Learning, out", "in the *world."]}</SplitTitle>
          </div>
          <Reveal variant="blur" as="p" className="section-lead" delay={0.2}>
            Some of the best lessons happen beyond the classroom — in production models and in the systems that keep a
            city moving.
          </Reveal>
        </div>
        <div className="timeline" ref={ref}>
          <div className="timeline-rail" aria-hidden="true">
            <motion.span style={{ scaleY }} />
          </div>
          {experience.map((item, i) => (
            <ExpCard key={item.company} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
