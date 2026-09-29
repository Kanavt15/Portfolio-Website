'use client';
import { useRef, useCallback, useEffect } from 'react';
import gsap from 'gsap';

/**
 * Wraps any child element and gives it a magnetic pull-toward-cursor effect.
 * The element physically moves toward the mouse when hovered, creating
 * a satisfying, premium feel. Strength controls the pull intensity.
 */
export default function MagneticButton({ children, strength = 0.35, className = '', style = {} }) {
  const ref = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  const handleMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    pos.current = { x: dx, y: dy };
    gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power3.out' });
  }, [strength]);

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
  }, []);

  return (
    <div
      ref={ref}
      className={`magnetic-wrap ${className}`}
      style={{ display: 'inline-block', ...style }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}
