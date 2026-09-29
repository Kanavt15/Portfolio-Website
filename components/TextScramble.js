'use client';
import { useEffect, useRef, useCallback } from 'react';

/**
 * Text scramble/decode effect.
 * Characters cycle through random glyphs before resolving to the real text.
 * Used on section headings for a hacker/cyber aesthetic.
 */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`';

export default function TextScramble({ text, className = '', as: Tag = 'span', triggerOnView = true }) {
  const ref = useRef(null);
  const hasPlayed = useRef(false);

  const scramble = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const original = text;
    const length = original.length;
    let iteration = 0;
    const maxIterations = length * 3;

    const interval = setInterval(() => {
      el.textContent = original
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < iteration / 3) return original[index];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');

      iteration++;
      if (iteration >= maxIterations) {
        clearInterval(interval);
        el.textContent = original;
      }
    }, 25);

    return () => clearInterval(interval);
  }, [text]);

  useEffect(() => {
    if (!triggerOnView) {
      scramble();
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayed.current) {
          hasPlayed.current = true;
          scramble();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [scramble, triggerOnView]);

  return (
    <Tag ref={ref} className={`text-scramble ${className}`}>
      {text}
    </Tag>
  );
}
