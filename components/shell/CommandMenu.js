"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { nav, profile, projects } from "@/lib/data";
import { scrollToTarget, useShell } from "./AppShell";
import { ArrowRight, ArrowUpRight } from "../ui/icons";

export default function CommandMenu({ open, onClose }) {
  const { notify } = useShell();
  const [q, setQ] = useState("");
  const [index, setIndex] = useState(0);
  const input = useRef(null);

  const items = useMemo(
    () => [
      ...nav.map((n) => ({ group: "Navigate", label: n.label, run: () => scrollToTarget(`#${n.id}`) })),
      ...projects.map((p) => ({
        group: "Projects",
        label: p.name,
        hint: p.type,
        external: true,
        run: () => window.open(p.live || p.source, "_blank", "noopener"),
      })),
      {
        group: "Actions",
        label: "Copy email address",
        run: () => {
          navigator.clipboard?.writeText(profile.email);
          notify("Email copied to clipboard");
        },
      },
      { group: "Actions", label: "Open résumé", external: true, run: () => window.open(profile.resume, "_blank") },
      { group: "Actions", label: "GitHub", external: true, run: () => window.open(profile.github, "_blank") },
      { group: "Actions", label: "LinkedIn", external: true, run: () => window.open(profile.linkedin, "_blank") },
    ],
    [notify],
  );

  const filtered = items.filter((i) => `${i.label} ${i.hint ?? ""} ${i.group}`.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    if (open) {
      setQ("");
      setIndex(0);
      setTimeout(() => input.current?.focus(), 50);
    }
  }, [open]);

  function onKey(e) {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[index]) {
      filtered[index].run();
      onClose();
    }
  }

  let lastGroup = null;
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cmdk-overlay"
          onPointerDown={(e) => e.target === e.currentTarget && onClose()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="cmdk"
            role="dialog"
            aria-label="Command menu"
            initial={{ opacity: 0, scale: 0.94, y: -10, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96, y: -6, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            onKeyDown={onKey}
          >
            <input
              ref={input}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setIndex(0);
              }}
              placeholder="Type a command or search…"
              aria-label="Search commands"
            />
            <div className="cmdk-list" role="listbox">
              {filtered.length === 0 && <div className="cmdk-empty">No results for “{q}”.</div>}
              {filtered.map((item, i) => {
                const header = item.group !== lastGroup;
                lastGroup = item.group;
                return (
                  <div key={item.group + item.label}>
                    {header && <div className="cmdk-group">{item.group}</div>}
                    <button
                      className={`cmdk-item${i === index ? " active" : ""}`}
                      role="option"
                      aria-selected={i === index}
                      onPointerMove={() => setIndex(i)}
                      onClick={() => {
                        item.run();
                        onClose();
                      }}
                      style={{ isolation: "isolate" }}
                    >
                      {i === index && (
                        <motion.span
                          layoutId="cmdk-hl"
                          className="hl"
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        />
                      )}
                      <span>
                        {item.label}
                        {item.hint && <small style={{ color: "var(--faint)", marginLeft: 10 }}>{item.hint}</small>}
                      </span>
                      {item.external ? <ArrowUpRight size={14} /> : <ArrowRight size={14} />}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="cmdk-foot">
              <span>
                <kbd>↑</kbd> <kbd>↓</kbd> navigate
              </span>
              <span>
                <kbd>↵</kbd> select
              </span>
              <span>
                <kbd>esc</kbd> close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
