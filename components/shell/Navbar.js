"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { nav } from "@/lib/data";
import { useShell } from "./AppShell";
import { Search } from "../ui/icons";

export default function Navbar() {
  const { loaded, setCmdOpen } = useShell();
  const [active, setActive] = useState("");
  const [hovered, setHovered] = useState(null);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  // Hide on scroll down, reveal on scroll up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 400 && !open);
  });

  // Active section tracking.
  useEffect(() => {
    const els = nav.map((n) => document.getElementById(n.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const pill = hovered ?? active;

  return (
    <>
      <motion.header
        className="navbar"
        initial={{ y: -100, opacity: 0 }}
        animate={loaded ? { y: hidden ? -100 : 0, opacity: hidden ? 0 : 1 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: loaded && !hidden ? 0.1 : 0 }}
      >
        <nav className="navbar-inner" aria-label="Main">
          <a href="#home" className="nav-logo" aria-label="Kanav Trivedi — home">
            KT
          </a>
          <div className="nav-links" onPointerLeave={() => setHovered(null)}>
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`nav-link${active === item.id ? " active" : ""}`}
                onPointerEnter={() => setHovered(item.id)}
                aria-current={active === item.id ? "true" : undefined}
              >
                {pill === item.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="nav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {item.label}
              </a>
            ))}
          </div>
          <button className="nav-kbd" onClick={() => setCmdOpen(true)} aria-label="Open command menu">
            <Search /> Ctrl K
          </button>
          <button
            className={`nav-menu-btn${open ? " open" : ""}`}
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            <span />
            <span />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 44px) 44px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            {nav.map((item, i) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <small>0{i + 1}</small>
                {item.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
