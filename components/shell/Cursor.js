"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

// Dot follows instantly; ring trails with a spring and morphs over interactive
// elements. Elements can set data-cursor="View" to show a label.
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState("");
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 350, damping: 30, mass: 0.5 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.body.classList.add("has-cursor");
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target.closest?.("a, button, [data-cursor], input");
      setHover(!!t);
      setLabel(t?.dataset?.cursor || "");
    };
    const d = () => setDown(true);
    const u = () => setDown(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", d);
    window.addEventListener("pointerup", u);
    return () => {
      document.body.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", d);
      window.removeEventListener("pointerup", u);
    };
  }, [x, y]);

  if (!enabled) return null;
  const scale = label ? 2.2 : hover ? 1.6 : 1;
  return (
    <>
      <motion.div className="cursor-dot" style={{ x, y }} animate={{ scale: hover ? 0 : down ? 0.6 : 1 }} />
      <motion.div
        className="cursor-ring"
        style={{ x: rx, y: ry }}
        animate={{
          scale: down ? scale * 0.85 : scale,
          backgroundColor: label ? "rgba(255,255,255,1)" : hover ? "rgba(139,124,255,0.14)" : "rgba(139,124,255,0)",
          borderColor: label ? "rgba(255,255,255,1)" : hover ? "rgba(167,155,255,0.8)" : "rgba(255,255,255,0.35)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        <motion.span animate={{ opacity: label ? 1 : 0, scale: label ? 1 / 2.2 : 0.3 }} style={{ fontSize: 12, fontWeight: 600 }}>
          {label}
        </motion.span>
      </motion.div>
    </>
  );
}
