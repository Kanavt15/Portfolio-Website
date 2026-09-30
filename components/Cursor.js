'use client';
import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

const TRAIL_COUNT = 12;
const PARTICLE_POOL = 20;

export default function Cursor() {
  const cursorRef = useRef(null);
  const crosshairRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);
  const trailRefs = useRef([]);
  const particleContainerRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const glowPos = useRef({ x: -100, y: -100 });
  const trailPositions = useRef(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }))
  );
  const rafRef = useRef(null);
  const velocityRef = useRef({ x: 0, y: 0 });
  const prevPos = useRef({ x: -100, y: -100 });
  const ringAngle = useRef(0);
  const hueRef = useRef(0);
  const particleIndex = useRef(0);
  const lastParticleTime = useRef(0);

  // Spawn click burst particles
  const spawnBurst = useCallback((x, y) => {
    if (!particleContainerRef.current) return;
    const count = 8;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'cursor__burst';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particleContainerRef.current.appendChild(particle);

      const angle = (Math.PI * 2 * i) / count;
      const dist = 40 + Math.random() * 30;

      gsap.fromTo(
        particle,
        { scale: 1, opacity: 0.9, x: 0, y: 0 },
        {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          scale: 0,
          opacity: 0,
          duration: 0.6,
          ease: 'expo.out',
          onComplete: () => particle.remove(),
        }
      );
    }
  }, []);

  // Spawn trailing aurora particles on fast movement
  const spawnTrailParticle = useCallback((x, y, speed) => {
    if (!particleContainerRef.current) return;
    const particle = document.createElement('div');
    particle.className = 'cursor__aurora-particle';
    particle.style.left = `${x + (Math.random() - 0.5) * 20}px`;
    particle.style.top = `${y + (Math.random() - 0.5) * 20}px`;
    const size = 3 + Math.random() * 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particleContainerRef.current.appendChild(particle);

    gsap.fromTo(
      particle,
      { scale: 1, opacity: 0.6 },
      {
        scale: 0,
        opacity: 0,
        y: (Math.random() - 0.5) * 40,
        x: (Math.random() - 0.5) * 40,
        duration: 0.5 + Math.random() * 0.4,
        ease: 'power2.out',
        onComplete: () => particle.remove(),
      }
    );
  }, []);

  useEffect(() => {
    const crosshair = crosshairRef.current;
    const ring = ringRef.current;
    const glow = glowRef.current;
    const trails = trailRefs.current;

    const onMove = (e) => {
      prevPos.current = { ...pos.current };
      pos.current = { x: e.clientX, y: e.clientY };
      velocityRef.current = {
        x: pos.current.x - prevPos.current.x,
        y: pos.current.y - prevPos.current.y,
      };
      gsap.set(crosshair, { x: e.clientX, y: e.clientY });
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      const speed = Math.sqrt(
        velocityRef.current.x ** 2 + velocityRef.current.y ** 2
      );

      // Ring follows with springy delay
      ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.15);
      ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.15);

      // Glow follows with even more delay
      glowPos.current.x = lerp(glowPos.current.x, pos.current.x, 0.08);
      glowPos.current.y = lerp(glowPos.current.y, pos.current.y, 0.08);

      // Rotating ring with velocity-based morph
      ringAngle.current += 0.03;
      const morph = Math.min(speed * 0.5, 18);
      const a1 = 50 + Math.sin(ringAngle.current) * morph;
      const a2 = 50 + Math.cos(ringAngle.current * 0.7) * morph;
      const a3 = 50 + Math.sin(ringAngle.current * 1.3 + 1) * morph;
      const a4 = 50 + Math.cos(ringAngle.current * 0.5 + 2) * morph;

      const angle = Math.atan2(velocityRef.current.y, velocityRef.current.x);
      const rotDeg = speed > 1 ? (angle * 180) / Math.PI : 0;

      // Scale ring based on speed
      const ringScale = 1 + Math.min(speed * 0.005, 0.2);

      gsap.set(ring, {
        x: ringPos.current.x,
        y: ringPos.current.y,
        borderRadius: `${a1}% ${100 - a1}% ${a2}% ${100 - a2}% / ${a3}% ${a4}% ${100 - a4}% ${100 - a3}%`,
        rotation: rotDeg * 0.3 + ringAngle.current * 2,
        scale: ringScale,
      });

      // Update glow orb
      gsap.set(glow, {
        x: glowPos.current.x,
        y: glowPos.current.y,
        opacity: Math.min(speed * 0.03, 0.4),
      });

      // Trail follows with cascading delay — aurora trail
      for (let i = TRAIL_COUNT - 1; i > 0; i--) {
        trailPositions.current[i].x = lerp(
          trailPositions.current[i].x,
          trailPositions.current[i - 1].x,
          0.28
        );
        trailPositions.current[i].y = lerp(
          trailPositions.current[i].y,
          trailPositions.current[i - 1].y,
          0.28
        );
      }
      trailPositions.current[0].x = lerp(
        trailPositions.current[0].x,
        pos.current.x,
        0.45
      );
      trailPositions.current[0].y = lerp(
        trailPositions.current[0].y,
        pos.current.y,
        0.45
      );

      // Cycle hue for aurora effect
      hueRef.current = (hueRef.current + 0.5) % 360;

      trails.forEach((trail, i) => {
        if (!trail) return;
        const trailOpacity = speed > 2 ? (1 - i / TRAIL_COUNT) * 0.6 : 0;
        gsap.set(trail, {
          x: trailPositions.current[i].x,
          y: trailPositions.current[i].y,
          opacity: trailOpacity,
          scale: 1 - (i / TRAIL_COUNT) * 0.5,
        });
      });

      // Spawn floating particles on fast movement
      const now = Date.now();
      if (speed > 4 && now - lastParticleTime.current > 40) {
        spawnTrailParticle(pos.current.x, pos.current.y, speed);
        lastParticleTime.current = now;
      }

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
      spawnBurst(pos.current.x, pos.current.y);
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
  }, [spawnBurst, spawnTrailParticle]);

  return (
    <div className="cursor" ref={cursorRef}>
      {/* Aurora trail dots */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          className="cursor__trail"
          ref={(el) => (trailRefs.current[i] = el)}
          style={{ '--trail-i': i }}
        />
      ))}
      {/* Glow orb */}
      <div className="cursor__glow" ref={glowRef} />
      {/* Morphing ring */}
      <div className="cursor__ring" ref={ringRef} />
      {/* Crosshair center */}
      <div className="cursor__crosshair" ref={crosshairRef}>
        <span className="cursor__crosshair-line cursor__crosshair-line--h" />
        <span className="cursor__crosshair-line cursor__crosshair-line--v" />
        <span className="cursor__crosshair-dot" />
      </div>
      {/* Particle container for bursts & aurora */}
      <div className="cursor__particle-container" ref={particleContainerRef} />
    </div>
  );
}
