'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

/**
 * A stylish scroll progress indicator.
 * Thin red line at the very top of the viewport that fills as you scroll.
 * Plus a circular percentage indicator at bottom-right.
 */
export default function ScrollProgress() {
  const barRef = useRef(null);
  const circleRef = useRef(null);
  const percentRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const bar = barRef.current;
    const circle = circleRef.current;
    const percentEl = percentRef.current;
    const wrap = wrapRef.current;

    if (!bar || !circle || !percentEl || !wrap) return;

    const circumference = 2 * Math.PI * 18; // radius = 18
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);

      // Update bar width
      bar.style.transform = `scaleX(${progress})`;

      // Update circle
      const offset = circumference - (progress * circumference);
      circle.style.strokeDashoffset = offset;

      // Update percentage
      percentEl.textContent = `${Math.round(progress * 100)}`;

      // Show/hide the circular indicator
      if (scrollTop > 200) {
        wrap.classList.add('visible');
      } else {
        wrap.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top progress bar */}
      <div className="scroll-progress-bar" aria-hidden="true">
        <div className="scroll-progress-bar__fill" ref={barRef} />
      </div>

      {/* Circular progress indicator */}
      <div
        className="scroll-progress-circle"
        ref={wrapRef}
        onClick={scrollToTop}
        data-hover
        aria-label="Scroll progress"
      >
        <svg width="44" height="44" viewBox="0 0 44 44">
          <circle
            cx="22" cy="22" r="18"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="2"
          />
          <circle
            ref={circleRef}
            cx="22" cy="22" r="18"
            fill="none"
            stroke="var(--red)"
            strokeWidth="2"
            strokeLinecap="round"
            transform="rotate(-90 22 22)"
          />
        </svg>
        <span className="scroll-progress-circle__text" ref={percentRef}>0</span>
      </div>
    </>
  );
}
