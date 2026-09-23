'use client';
import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

const TRAIL_COUNT = 8;

export default function Cursor() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const blobRef = useRef(null);
  const trailRefs = useRef([]);
  const rippleContainerRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const blobPos = useRef({ x: -100, y: -100 });
  const trailPositions = useRef(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }))
  );
  const rafRef = useRef(null);
  const velocityRef = useRef({ x: 0, y: 0 });
  const prevPos = useRef({ x: -100, y: -100 });
  const morphAngle = useRef(0);

  const spawnRipple = useCallback((x, y) => {
    if (!rippleContainerRef.current) return;
    const ripple = document.createElement('div');
    ripple.className = 'cursor__ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    rippleContainerRef.current.appendChild(ripple);

    gsap.fromTo(
      ripple,
      { scale: 0, opacity: 0.6 },
      {
        scale: 3,
        opacity: 0,
        duration: 0.7,
        ease: 'expo.out',
        onComplete: () => ripple.remove(),
      }
    );
  }, []);

  useEffect(() => {
    const dot = dotRef.current;
    const blob = blobRef.current;
    const trails = trailRefs.current;

    const onMove = (e) => {
      prevPos.current = { ...pos.current };
      pos.current = { x: e.clientX, y: e.clientY };
      velocityRef.current = {
        x: pos.current.x - prevPos.current.x,
        y: pos.current.y - prevPos.current.y,
      };
      gsap.set(dot, { x: e.clientX, y: e.clientY });
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      // Blob follows with delay
      blobPos.current.x = lerp(blobPos.current.x, pos.current.x, 0.12);
      blobPos.current.y = lerp(blobPos.current.y, pos.current.y, 0.12);
      
      // Morphing border-radius based on movement
      morphAngle.current += 0.04;
      const speed = Math.sqrt(
        velocityRef.current.x ** 2 + velocityRef.current.y ** 2
      );
      const morph = Math.min(speed * 0.4, 15);
      const a1 = 50 + Math.sin(morphAngle.current) * morph;
      const a2 = 50 + Math.cos(morphAngle.current * 0.8) * morph;
      const a3 = 50 + Math.sin(morphAngle.current * 1.2 + 1) * morph;
      const a4 = 50 + Math.cos(morphAngle.current * 0.6 + 2) * morph;

      // Calculate slight rotation based on movement direction
      const angle = Math.atan2(velocityRef.current.y, velocityRef.current.x);
      const rotDeg = speed > 1 ? (angle * 180) / Math.PI : 0;

      gsap.set(blob, {
        x: blobPos.current.x,
        y: blobPos.current.y,
        borderRadius: `${a1}% ${100 - a1}% ${a2}% ${100 - a2}% / ${a3}% ${a4}% ${100 - a4}% ${100 - a3}%`,
        rotation: rotDeg * 0.3,
      });

      // Trail follows with cascading delay
      for (let i = TRAIL_COUNT - 1; i > 0; i--) {
        trailPositions.current[i].x = lerp(
          trailPositions.current[i].x,
          trailPositions.current[i - 1].x,
          0.25
        );
        trailPositions.current[i].y = lerp(
          trailPositions.current[i].y,
          trailPositions.current[i - 1].y,
          0.25
        );
      }
      trailPositions.current[0].x = lerp(
        trailPositions.current[0].x,
        pos.current.x,
        0.4
      );
      trailPositions.current[0].y = lerp(
        trailPositions.current[0].y,
        pos.current.y,
        0.4
      );

      trails.forEach((trail, i) => {
        if (!trail) return;
        gsap.set(trail, {
          x: trailPositions.current[i].x,
          y: trailPositions.current[i].y,
          opacity: speed > 1.5 ? (1 - i / TRAIL_COUNT) * 0.5 : 0,
        });
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    document.addEventListener('mousemove', onMove);

    // Hover state
    const cursor = cursorRef.current;
    const addHover = () => cursor?.classList.add('hovering');
    const rmHover = () => cursor?.classList.remove('hovering');
    const addClick = () => {
      cursor?.classList.add('clicking');
      spawnRipple(pos.current.x, pos.current.y);
    };
    const rmClick = () => cursor?.classList.remove('clicking');

    document.addEventListener('mousedown', addClick);
    document.addEventListener('mouseup', rmClick);

    const magneticEls = document.querySelectorAll('[data-magnetic]');
    magneticEls.forEach((el) => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', rmHover);
    });

    const hoverEls = document.querySelectorAll('a, button, [data-hover]');
    hoverEls.forEach((el) => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', rmHover);
    });

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', addClick);
      document.removeEventListener('mouseup', rmClick);
      cancelAnimationFrame(rafRef.current);
    };
  }, [spawnRipple]);

  return (
    <div className="cursor" ref={cursorRef}>
      {/* Fading trail dots */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          className="cursor__trail"
          ref={(el) => (trailRefs.current[i] = el)}
          style={{ '--trail-i': i }}
        />
      ))}
      {/* Morphing blob ring */}
      <div className="cursor__blob" ref={blobRef} />
      {/* Center dot */}
      <div className="cursor__dot" ref={dotRef} />
      {/* Ripple container */}
      <div className="cursor__ripple-container" ref={rippleContainerRef} />
    </div>
  );
}
