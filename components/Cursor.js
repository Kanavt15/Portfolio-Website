'use client';
import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

// Number of helix strand points
const HELIX_POINTS = 10;

export default function Cursor() {
  const dotRef = useRef(null);
  const helixContainerRef = useRef(null);
  const splashContainerRef = useRef(null);
  const labelRef = useRef(null);
  const helixRefs = useRef({ a: [], b: [] });

  const pos = useRef({ x: -200, y: -200 });
  const dotPos = useRef({ x: -200, y: -200 });
  const helixPositions = useRef(
    Array.from({ length: HELIX_POINTS }, () => ({ x: -200, y: -200 }))
  );
  const rafRef = useRef(null);
  const velocityRef = useRef({ x: 0, y: 0 });
  const prevPos = useRef({ x: -200, y: -200 });
  const phaseRef = useRef(0);
  const isHovering = useRef(false);
  const isClicking = useRef(false);

  // Ink splash on click
  const spawnSplash = useCallback((x, y) => {
    if (!splashContainerRef.current) return;
    const count = 6 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      const drop = document.createElement('div');
      drop.className = 'cursor__ink-drop';
      const size = 3 + Math.random() * 6;
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.8;
      const dist = 20 + Math.random() * 35;
      drop.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;`;
      splashContainerRef.current.appendChild(drop);
      gsap.fromTo(drop,
        { x: 0, y: 0, scale: 1, opacity: 1, borderRadius: '50%' },
        {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          scale: 0,
          opacity: 0,
          borderRadius: `${20 + Math.random() * 30}%`,
          duration: 0.55 + Math.random() * 0.3,
          ease: 'power3.out',
          onComplete: () => drop.remove(),
        }
      );
    }
    // Center burst ripple
    const ripple = document.createElement('div');
    ripple.className = 'cursor__ink-ripple';
    ripple.style.cssText = `left:${x}px;top:${y}px;`;
    splashContainerRef.current.appendChild(ripple);
    gsap.fromTo(ripple,
      { scale: 0, opacity: 0.5 },
      { scale: 4, opacity: 0, duration: 0.6, ease: 'expo.out', onComplete: () => ripple.remove() }
    );
  }, []);

  useEffect(() => {
    const dot = dotRef.current;
    const helixContainer = helixContainerRef.current;
    const label = labelRef.current;
    const strandA = helixRefs.current.a;
    const strandB = helixRefs.current.b;

    const lerp = (a, b, t) => a + (b - a) * t;

    const onMove = (e) => {
      prevPos.current = { ...pos.current };
      pos.current = { x: e.clientX, y: e.clientY };
      velocityRef.current = {
        x: pos.current.x - prevPos.current.x,
        y: pos.current.y - prevPos.current.y,
      };

      // Move label
      if (label) {
        gsap.set(label, { x: e.clientX + 18, y: e.clientY - 8 });
      }
    };

    const tick = () => {
      phaseRef.current += 0.12;

      const speed = Math.sqrt(
        velocityRef.current.x ** 2 + velocityRef.current.y ** 2
      );

      // Liquid dot follows with magnetic snap
      const dotLerp = isHovering.current ? 0.22 : 0.18;
      dotPos.current.x = lerp(dotPos.current.x, pos.current.x, dotLerp);
      dotPos.current.y = lerp(dotPos.current.y, pos.current.y, dotLerp);

      // Dot stretch based on velocity (squash & stretch)
      const stretchX = isClicking.current ? 0.7 : Math.max(0.7, 1 - speed * 0.015);
      const stretchY = isClicking.current ? 0.7 : Math.min(1.6, 1 + speed * 0.015);
      const angle = Math.atan2(velocityRef.current.y, velocityRef.current.x);

      const dotSize = isHovering.current ? 42 : isClicking.current ? 6 : 12;

      gsap.set(dot, {
        x: dotPos.current.x,
        y: dotPos.current.y,
        scaleX: isHovering.current ? 1 : stretchX,
        scaleY: isHovering.current ? 1 : stretchY,
        rotation: speed > 1 ? (angle * 180) / Math.PI : 0,
        width: dotSize,
        height: dotSize,
      });

      // Trail helix positions
      for (let i = HELIX_POINTS - 1; i > 0; i--) {
        helixPositions.current[i].x = lerp(
          helixPositions.current[i].x,
          helixPositions.current[i - 1].x,
          0.35
        );
        helixPositions.current[i].y = lerp(
          helixPositions.current[i].y,
          helixPositions.current[i - 1].y,
          0.35
        );
      }
      helixPositions.current[0].x = lerp(helixPositions.current[0].x, dotPos.current.x, 0.5);
      helixPositions.current[0].y = lerp(helixPositions.current[0].y, dotPos.current.y, 0.5);

      // Update helix strands — double helix oscillating perpendicular to movement direction
      const moveAngle = Math.atan2(velocityRef.current.y, velocityRef.current.x);
      const perpX = -Math.sin(moveAngle);
      const perpY = Math.cos(moveAngle);
      const helixAmplitude = Math.min(speed * 1.2, 10);
      const helixOpacity = Math.min(speed / 5, 1);

      strandA.forEach((pt, i) => {
        if (!pt) return;
        const t = i / HELIX_POINTS;
        const wave = Math.sin(phaseRef.current - i * 0.6) * helixAmplitude;
        const alpha = (1 - t) * 0.7 * helixOpacity;
        const size = (1 - t) * 4 + 2;
        gsap.set(pt, {
          x: helixPositions.current[i].x + perpX * wave,
          y: helixPositions.current[i].y + perpY * wave,
          opacity: alpha,
          width: size,
          height: size,
        });
      });

      strandB.forEach((pt, i) => {
        if (!pt) return;
        const t = i / HELIX_POINTS;
        const wave = Math.sin(phaseRef.current - i * 0.6 + Math.PI) * helixAmplitude;
        const alpha = (1 - t) * 0.4 * helixOpacity;
        const size = (1 - t) * 3 + 1.5;
        gsap.set(pt, {
          x: helixPositions.current[i].x + perpX * wave,
          y: helixPositions.current[i].y + perpY * wave,
          opacity: alpha,
          width: size,
          height: size,
        });
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    document.addEventListener('mousemove', onMove);

    // Hover
    const handleEnter = (e) => {
      isHovering.current = true;
      dot.classList.add('hovering');
      const labelText = e.currentTarget.dataset.cursorLabel;
      if (label && labelText) {
        label.textContent = labelText;
        gsap.to(label, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
      }
    };
    const handleLeave = () => {
      isHovering.current = false;
      dot.classList.remove('hovering');
      if (label) {
        gsap.to(label, { opacity: 0, y: 6, duration: 0.2 });
        label.textContent = '';
      }
    };
    const handleDown = () => {
      isClicking.current = true;
      dot.classList.add('clicking');
      spawnSplash(pos.current.x, pos.current.y);
    };
    const handleUp = () => {
      isClicking.current = false;
      dot.classList.remove('clicking');
    };

    document.addEventListener('mousedown', handleDown);
    document.addEventListener('mouseup', handleUp);

    // Attach hover to interactive elements
    const query = 'a, button, [data-hover], [data-magnetic], [data-cursor-label]';
    const attachHover = () => {
      document.querySelectorAll(query).forEach((el) => {
        el.addEventListener('mouseenter', handleEnter);
        el.addEventListener('mouseleave', handleLeave);
      });
    };
    attachHover();

    // Re-attach after DOM changes (e.g., modals)
    const observer = new MutationObserver(attachHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', handleDown);
      document.removeEventListener('mouseup', handleUp);
      observer.disconnect();
    };
  }, [spawnSplash]);

  return (
    <>
      {/* Helix strand A (solid) */}
      {Array.from({ length: HELIX_POINTS }).map((_, i) => (
        <div
          key={`a${i}`}
          className="cursor__helix cursor__helix--a"
          ref={(el) => (helixRefs.current.a[i] = el)}
        />
      ))}
      {/* Helix strand B (hollow) */}
      {Array.from({ length: HELIX_POINTS }).map((_, i) => (
        <div
          key={`b${i}`}
          className="cursor__helix cursor__helix--b"
          ref={(el) => (helixRefs.current.b[i] = el)}
        />
      ))}
      {/* Liquid magnetic dot */}
      <div className="cursor__liquid-dot" ref={dotRef} />
      {/* Contextual label */}
      <div className="cursor__label" ref={labelRef} />
      {/* Ink splash container */}
      <div className="cursor__splash-container" ref={splashContainerRef} />
    </>
  );
}
