"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { profile, projects } from "@/lib/data";
import { Eyebrow, Magnetic, Reveal, SplitTitle } from "../ui/primitives";
import { ArrowUpRight, Github } from "../ui/icons";

function ProjectCard({ project, index, total, progress }) {
  const media = useRef(null);
  // As later cards stack on top, earlier ones shrink and dim.
  const targetScale = 1 - (total - index - 1) * 0.04;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const dim = useTransform(progress, [index / total, (index + 1) / total], [1, 0.55]);

  const { scrollYProgress: local } = useScroll({ target: media, offset: ["start end", "end start"] });
  const imgY = useTransform(local, [0, 1], ["-8%", "4%"]);

  const domain = (project.live || project.source).replace(/^https?:\/\//, "").split("/")[0];

  return (
    <div className="project-sticky">
      <motion.article
        className="project-card"
        style={{ scale, top: `calc(${index * 22}px)`, "--pc": project.accent }}
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div className="project-info" style={{ opacity: index === total - 1 ? 1 : dim }}>
          <div className="project-index">
            <span>
              <b>{String(index + 1).padStart(2, "0")}</b> / {String(total).padStart(2, "0")}
            </span>
            <span>{project.year}</span>
          </div>
          <h3>{project.name}</h3>
          <span className="project-type">{project.type}</span>
          <p>{project.description}</p>
          <div className="chips">
            {project.tags.map((t) => (
              <span className="chip" key={t}>
                {t}
              </span>
            ))}
          </div>
          <div className="project-links">
            {project.live && (
              <Magnetic strength={0.25}>
                <a className="btn btn-primary" href={project.live} target="_blank" rel="noreferrer">
                  {project.liveLabel || "Live site"} <ArrowUpRight size={16} />
                </a>
              </Magnetic>
            )}
            <Magnetic strength={0.25}>
              <a className="btn btn-ghost" href={project.source} target="_blank" rel="noreferrer">
                <Github width={16} height={16} /> Source
              </a>
            </Magnetic>
          </div>
        </motion.div>
        <a
          ref={media}
          className="project-media"
          href={project.live || project.source}
          target="_blank"
          rel="noreferrer"
          data-cursor="Open"
          aria-label={`Open ${project.name}`}
        >
          <div className="browser-bar" aria-hidden="true">
            <i />
            <i />
            <i />
            <span>{domain}</span>
          </div>
          <motion.div className="project-media-img" style={{ y: imgY }} whileHover={{ scale: 1.04 }} transition={{ duration: 0.6 }}>
            <Image
              src={project.image}
              alt={`${project.name} preview`}
              fill
              sizes="(max-width: 900px) 92vw, 640px"
              style={{ objectFit: "cover", objectPosition: "top center" }}
            />
          </motion.div>
        </a>
      </motion.article>
    </div>
  );
}

export default function Projects() {
  const stack = useRef(null);
  const { scrollYProgress } = useScroll({ target: stack, offset: ["start start", "end end"] });

  return (
    <section id="projects" className="section" aria-labelledby="projects-title" style={{ paddingBottom: 40 }}>
      <div className="container">
        <div className="section-head" style={{ marginBottom: 0 }}>
          <div>
            <Eyebrow num="03">Selected work</Eyebrow>
            <SplitTitle id="projects-title">{["Ideas you can", "*step into."]}</SplitTitle>
          </div>
          <Reveal variant="blur" as="p" className="section-lead" delay={0.2}>
            Five projects across 3D, full-stack and machine learning. Scroll — each one stacks onto the last.
          </Reveal>
        </div>
        <div className="projects-stack" ref={stack}>
          {projects.map((p, i) => (
            <ProjectCard key={p.name} project={p} index={i} total={projects.length} progress={scrollYProgress} />
          ))}
        </div>
        <Reveal variant="up" className="github-cta">
          <a className="btn btn-shimmer" href={profile.github} target="_blank" rel="noreferrer">
            <span className="btn-shimmer-inner">
              <Github width={18} height={18} /> More experiments on GitHub <ArrowUpRight size={16} />
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
