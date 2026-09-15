'use client';
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export default function SmoothScroll({ children }) {
  const lenisRef    = useRef(null);
  const rafIdRef    = useRef(null);
  const tickerFnRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // ── Init Lenis (v1.x API) ──────────────────────────────
    const lenis = new Lenis({
      lerp: 0.1,          // smoothness factor (0 = instant, 1 = never)
      smoothWheel: true,
      smoothTouch: false,
    });

    lenisRef.current = lenis;

    // Sync GSAP ScrollTrigger with Lenis scroll position
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker (store ref so we can remove it)
    const tickerFn = (time) => lenis.raf(time * 1000);
    tickerFnRef.current = tickerFn;
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    // ── Anchor-click handler ───────────────────────────────
    const handleClick = (e) => {
      // Walk up the DOM to find the nearest anchor
      const a = e.target.closest('a');
      if (!a) return;

      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#') || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      lenis.scrollTo(target, {
        lerp: 0.1,
        offset: 0,
      });
    };

    document.addEventListener('click', handleClick);

    // ── Cleanup ────────────────────────────────────────────
    return () => {
      document.removeEventListener('click', handleClick);
      gsap.ticker.remove(tickerFnRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
