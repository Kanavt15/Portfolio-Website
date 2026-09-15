'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Cursor() {
  const dotRef    = useRef(null);
  const circleRef = useRef(null);
  const cursorRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const circlePos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const dot    = dotRef.current;
    const circle = circleRef.current;
    const cursor = cursorRef.current;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      gsap.set(dot, { x: e.clientX, y: e.clientY });
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      circlePos.current.x = lerp(circlePos.current.x, pos.current.x, 0.12);
      circlePos.current.y = lerp(circlePos.current.y, pos.current.y, 0.12);
      gsap.set(circle, { x: circlePos.current.x, y: circlePos.current.y });
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    document.addEventListener('mousemove', onMove);

    // Hover state
    const addHover = () => cursor?.classList.add('hovering');
    const rmHover  = () => cursor?.classList.remove('hovering');
    const addClick = () => cursor?.classList.add('clicking');
    const rmClick  = () => cursor?.classList.remove('clicking');

    document.addEventListener('mousedown', addClick);
    document.addEventListener('mouseup',   rmClick);

    const magneticEls = document.querySelectorAll('[data-magnetic]');
    magneticEls.forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', rmHover);
    });

    const hoverEls = document.querySelectorAll('a, button, [data-hover]');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', rmHover);
    });

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', addClick);
      document.removeEventListener('mouseup',   rmClick);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="cursor" ref={cursorRef}>
      <div className="cursor__dot"    ref={dotRef} />
      <div className="cursor__circle" ref={circleRef} />
    </div>
  );
}
