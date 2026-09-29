'use client';
import { useEffect, useRef } from 'react';

/**
 * A radial spotlight gradient that follows the cursor within a section.
 * Creates a premium, dynamic lighting effect on dark backgrounds.
 * Wrap any section content with this for an ambient glow.
 */
export default function Spotlight({ children, className = '', color = '232, 0, 29', size = 600, opacity = 0.07 }) {
  const containerRef = useRef(null);
  const spotlightRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const spotlight = spotlightRef.current;
    if (!container || !spotlight) return;

    const handleMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spotlight.style.background = `radial-gradient(${size}px circle at ${x}px ${y}px, rgba(${color}, ${opacity}), transparent 70%)`;
    };

    const handleLeave = () => {
      spotlight.style.background = 'transparent';
      spotlight.style.transition = 'background 0.6s ease';
    };

    const handleEnter = () => {
      spotlight.style.transition = 'none';
    };

    container.addEventListener('mousemove', handleMove);
    container.addEventListener('mouseleave', handleLeave);
    container.addEventListener('mouseenter', handleEnter);

    return () => {
      container.removeEventListener('mousemove', handleMove);
      container.removeEventListener('mouseleave', handleLeave);
      container.removeEventListener('mouseenter', handleEnter);
    };
  }, [color, size, opacity]);

  return (
    <div ref={containerRef} className={`spotlight-container ${className}`} style={{ position: 'relative' }}>
      <div
        ref={spotlightRef}
        className="spotlight-effect"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          borderRadius: 'inherit',
          transition: 'background 0.6s ease',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
