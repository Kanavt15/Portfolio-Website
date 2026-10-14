"use client";

import { motion } from "motion/react";
import { awards } from "@/lib/data";
import { Eyebrow, Reveal, SplitTitle, TiltCard } from "../ui/primitives";
import { ArrowUpRight } from "../ui/icons";

export default function Awards() {
  return (
    <section id="awards" className="section" aria-labelledby="awards-title">
      <div className="container">
        <div className="section-head">
          <div>
            <Eyebrow num="05">Recognition</Eyebrow>
            <SplitTitle id="awards-title">{["A few things", "on the *mantel."]}</SplitTitle>
          </div>
          <Reveal variant="blur" as="p" className="section-lead" delay={0.2}>
            Milestones from competitions, learning, and showing up with something to share. Click any card to view the
            certificate.
          </Reveal>
        </div>
        <div className="awards-grid">
          {awards.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, rotateX: -50, y: 60 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: (i % 2) * 0.12 + Math.floor(i / 2) * 0.08 }}
              style={{ transformOrigin: "top center" }}
            >
              <TiltCard className="award-card" href={a.url} target="_blank" rel="noreferrer" data-cursor="View">
                <span className="award-shine" aria-hidden="true" />
                <span className="award-year" aria-hidden="true">
                  {a.year}
                </span>
                <div className="inner">
                  <div className="award-top">
                    <span className="award-kind">{a.kind}</span>
                    <span className="award-arrow">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                  <h3>{a.title}</h3>
                  <p>
                    {a.detail} · {a.org}
                  </p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
