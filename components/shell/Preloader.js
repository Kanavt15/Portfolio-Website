"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion } from "motion/react";

const words = ["Code", "Craft", "Curiosity"];

export default function Preloader({ onDone }) {
  const [count, setCount] = useState(0);
  const [word, setWord] = useState(0);
  const done = useRef(onDone);

  useEffect(() => {
    const controls = animate(0, 100, {
      duration: 1.8,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => setTimeout(() => done.current(), 250),
    });
    const t = setInterval(() => setWord((w) => Math.min(w + 1, words.length - 1)), 600);
    return () => {
      controls.stop();
      clearInterval(t);
    };
  }, []);

  return (
    <motion.div
      className="preloader"
      initial={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      aria-label="Loading"
      role="progressbar"
      aria-valuenow={count}
    >
      <motion.div
        className="preloader-inner"
        exit={{ y: -60, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="preloader-name">
          <span>Kanav Trivedi</span>
          <span style={{ overflow: "hidden", display: "inline-flex", height: "1.4em" }}>
            <motion.span key={word} initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 0.4 }}>
              {words[word]}
            </motion.span>
          </span>
        </div>
        <div className="preloader-count">
          {String(count).padStart(3, "0")}
          <span className="gradient-text">%</span>
        </div>
        <div className="preloader-bar">
          <span style={{ transform: `scaleX(${count / 100})` }} />
        </div>
      </motion.div>
    </motion.div>
  );
}
