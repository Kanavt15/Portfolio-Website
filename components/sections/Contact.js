"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { profile } from "@/lib/data";
import { scrollToTarget, useShell } from "../shell/AppShell";
import { Eyebrow, Magnetic, Reveal } from "../ui/primitives";
import { ArrowUp, ArrowUpRight, Check, Copy, FileText, Github, Linkedin, Mail, Phone } from "../ui/icons";

const ease = [0.22, 1, 0.36, 1];

/* macOS-style dock: icons magnify based on pointer distance. */
function DockItem({ mouseX, href, label, children, external }) {
  const ref = useRef(null);
  const [hover, setHover] = useState(false);
  const distance = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return x - r.x - r.width / 2;
  });
  const size = useSpring(useTransform(distance, [-140, 0, 140], [48, 76, 48]), { stiffness: 260, damping: 18, mass: 0.2 });
  return (
    <motion.a
      ref={ref}
      href={href}
      className="dock-item"
      style={{ width: size }}
      aria-label={label}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      <AnimatePresence>
        {hover && (
          <motion.span
            className="dock-tip"
            initial={{ opacity: 0, y: 8, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 4, x: "-50%" }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      {children}
    </motion.a>
  );
}

export function Dock() {
  const mouseX = useMotionValue(Infinity);
  return (
    <motion.div className="dock" onPointerMove={(e) => mouseX.set(e.clientX)} onPointerLeave={() => mouseX.set(Infinity)}>
      <DockItem mouseX={mouseX} href={profile.github} label="GitHub" external>
        <Github />
      </DockItem>
      <DockItem mouseX={mouseX} href={profile.linkedin} label="LinkedIn" external>
        <Linkedin />
      </DockItem>
      <DockItem mouseX={mouseX} href={`mailto:${profile.email}`} label="Email">
        <Mail />
      </DockItem>
      <DockItem mouseX={mouseX} href={`tel:${profile.phone}`} label="Call">
        <Phone />
      </DockItem>
      <DockItem mouseX={mouseX} href={profile.resume} label="Résumé" external>
        <FileText />
      </DockItem>
    </motion.div>
  );
}

export default function Contact() {
  const { notify } = useShell();
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {}
    setCopied(true);
    notify("Email copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  const lines = ["There’s always", "room for an", "idea."];

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="contact-glow" aria-hidden="true" />
      <div className="container">
        <Eyebrow num="06">Contact</Eyebrow>
        <h2 id="contact-title" className="contact-title">
          {lines.map((l, i) => (
            <span className="line" key={l}>
              <motion.span
                className={i === 2 ? "gradient-text" : ""}
                initial={{ y: "105%", skewY: 6 }}
                whileInView={{ y: "0%", skewY: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 1.1, ease, delay: i * 0.12 }}
              >
                {l}
              </motion.span>
            </span>
          ))}
        </h2>
        <Reveal as="p" variant="blur" className="contact-lead" delay={0.3}>
          Have a project, an opportunity, or something interesting in mind? Pull up a chair — my inbox is always open.
        </Reveal>

        <Reveal variant="scale" delay={0.4}>
          <Magnetic strength={0.15}>
            <button className="email-btn" onClick={copy} data-cursor="Copy" aria-label={`Copy email ${profile.email}`}>
              {profile.email}
              <span className="copy">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? "c" : "n"}
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    {copied ? <Check /> : <Copy />}
                  </motion.span>
                </AnimatePresence>
              </span>
            </button>
          </Magnetic>
        </Reveal>

        <Reveal variant="up" delay={0.5} className="contact-actions">
          <a className="btn btn-ghost" href={`mailto:${profile.email}`}>
            Write an email <ArrowUpRight size={16} />
          </a>
          <a className="btn btn-ghost" href={profile.resume} download>
            Download résumé <ArrowUpRight size={16} />
          </a>
        </Reveal>

        <Reveal variant="up" delay={0.6}>
          <Dock />
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const name = "Kanav Trivedi";
  return (
    <footer>
      <div className="footer-big" aria-hidden="true">
        {name.split("").map((c, i) => (
          <motion.span
            key={i}
            style={{ display: "inline-block", whiteSpace: "pre" }}
            initial={{ y: "60%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease, delay: i * 0.03 }}
          >
            {c}
          </motion.span>
        ))}
      </div>
      <div className="footer">
        <div className="container footer-inner">
          <span>© {new Date().getFullYear()} Kanav Trivedi · Built with curiosity in Mumbai.</span>
          <span>Press Ctrl K to navigate</span>
          <button className="to-top" onClick={() => scrollToTarget("#home")}>
            Back to top <ArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
}
