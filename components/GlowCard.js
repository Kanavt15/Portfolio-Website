'use client';
import { useRef, useCallback } from 'react';

/**
 * A card wrapper that creates a spotlight/glow effect following the cursor.
 * When hovered, a radial gradient appears at the mouse position creating
 * a sleek, glassmorphism-like highlight effect on the card border.
 */
export default function GlowCard({ children, className = '' }) {
  const cardRef = useRef(null);

  const handleMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--glow-x', `${x}px`);
    card.style.setProperty('--glow-y', `${y}px`);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`glow-card ${className}`}
      onMouseMove={handleMove}
    >
      {children}
    </div>
  );
}
