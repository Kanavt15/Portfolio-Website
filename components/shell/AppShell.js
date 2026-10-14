"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import Preloader from "./Preloader";
import Cursor from "./Cursor";
import Navbar from "./Navbar";
import CommandMenu from "./CommandMenu";
import { Check } from "../ui/icons";

const ShellContext = createContext(null);
export const useShell = () => useContext(ShellContext);

let lenisInstance = null;
export function scrollToTarget(target) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (lenisInstance) lenisInstance.scrollTo(el ?? 0, { offset: 0, duration: 1.4 });
  else (el ?? document.body).scrollIntoView({ behavior: "smooth" });
}

export default function AppShell({ children }) {
  const [loaded, setLoaded] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef();

  const notify = useCallback((msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  // Smooth scrolling
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.15, anchors: true, smoothWheel: true });
    lenisInstance = lenis;
    let id;
    const raf = (t) => {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // Lock scroll during the preloader
  useEffect(() => {
    if (loaded) {
      lenisInstance?.start();
      document.documentElement.style.overflow = "";
    } else {
      lenisInstance?.stop();
      document.documentElement.style.overflow = "hidden";
    }
  }, [loaded]);

  // ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (cmdOpen) lenisInstance?.stop();
    else if (loaded) lenisInstance?.start();
  }, [cmdOpen, loaded]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  return (
    <ShellContext.Provider value={{ loaded, setCmdOpen, notify }}>
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <div className="bg-aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="bg-noise" aria-hidden="true" />
      <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />
      <AnimatePresence>{!loaded && <Preloader onDone={() => setLoaded(true)} />}</AnimatePresence>
      <Cursor />
      <Navbar />
      <CommandMenu open={cmdOpen} onClose={() => setCmdOpen(false)} />
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            role="status"
            initial={{ opacity: 0, y: 30, x: "-50%", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: 20, x: "-50%", scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          >
            <Check size={16} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </ShellContext.Provider>
  );
}
