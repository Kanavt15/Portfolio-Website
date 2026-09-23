'use client';
import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const BG_NAME = 'KANAV TRIVEDI';

export default function Hero() {
  const sectionRef = useRef(null);
  const line1Ref   = useRef(null);
  const line2Ref   = useRef(null);
  const subRef     = useRef(null);
  const redLineRef = useRef(null);
  const eyebrowRef = useRef(null);
  const ctaRef     = useRef(null);
  const charRefs   = useRef([]);

  const handleCharHover = useCallback((index) => {
    const el = charRefs.current[index];
    if (!el || el.dataset.animating === 'true') return;
    el.dataset.animating = 'true';

    // Main character: jump + color flash + scale
    gsap.timeline({
      onComplete: () => { el.dataset.animating = 'false'; }
    })
      .to(el, {
        y: -18,
        scale: 1.3,
        color: '#e8001d',
        opacity: 0.35,
        duration: 0.25,
        ease: 'back.out(3)',
      })
      .to(el, {
        y: 0,
        scale: 1,
        color: '',
        opacity: '',
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
      });

    // Wave propagation to neighbors
    const neighbors = [
      { offset: -1, delay: 0.04, intensity: 0.6 },
      { offset: 1,  delay: 0.04, intensity: 0.6 },
      { offset: -2, delay: 0.08, intensity: 0.3 },
      { offset: 2,  delay: 0.08, intensity: 0.3 },
    ];

    neighbors.forEach(({ offset, delay, intensity }) => {
      const neighbor = charRefs.current[index + offset];
      if (!neighbor || neighbor.dataset.char === ' ') return;

      gsap.timeline({ delay })
        .to(neighbor, {
          y: -10 * intensity,
          scale: 1 + 0.15 * intensity,
          opacity: 0.12 + 0.2 * intensity,
          duration: 0.2,
          ease: 'power2.out',
        })
        .to(neighbor, {
          y: 0,
          scale: 1,
          opacity: '',
          duration: 0.45,
          ease: 'elastic.out(1, 0.4)',
        });
    });
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.1 } });

    // Entrance
    tl.fromTo(eyebrowRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7 })
      .fromTo(line1Ref.current,   { y: '110%' },           { y: '0%' },          '-=0.3')
      .fromTo(line2Ref.current,   { y: '110%' },           { y: '0%' },          '-=0.8')
      .fromTo(subRef.current,     { opacity: 0, y: 24 },   { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
      .fromTo(ctaRef.current,     { opacity: 0, y: 24 },   { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
      .to(redLineRef.current,     { width: '100%', duration: 0.9, ease: 'power3.inOut' }, '-=0.7');

    // Background name fade in
    charRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el,
        { opacity: 0, y: 20 },
        {
          opacity: el.dataset.char === ' ' ? 0 : 0.04,
          y: 0,
          duration: 0.8,
          delay: 0.6 + i * 0.03,
          ease: 'expo.out',
        }
      );
    });

    // Parallax on scroll
    gsap.to(sectionRef.current, {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => { tl.kill(); ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return (
    <section className="hero" ref={sectionRef} id="hero">
      {/* Background name watermark */}
      <div className="hero__bg-name" aria-hidden="true">
        {BG_NAME.split('').map((char, i) => (
          <span
            key={i}
            className={`hero__bg-char${char === ' ' ? ' hero__bg-char--space' : ''}`}
            ref={(el) => (charRefs.current[i] = el)}
            data-char={char}
            onMouseEnter={() => handleCharHover(i)}
            style={{ opacity: 0 }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>

      {/* Red baseline */}
      <div className="hero__red-line" ref={redLineRef} />

      <p className="hero__eyebrow" ref={eyebrowRef}>
        Mumbai, India — Available for opportunities
      </p>

      <h1 className="hero__title">
        <span className="hero__title-line">
          <span ref={line1Ref} style={{ display: 'block' }}>KANAV</span>
        </span>
        <span className="hero__title-line">
          <span ref={line2Ref} style={{ display: 'block' }}>
            TRI<em>VEDI</em>
          </span>
        </span>
      </h1>

      <div className="hero__sub" ref={subRef} style={{ opacity: 0 }}>
        <p className="hero__sub-text">
          Computer Engineering student crafting intelligent backends,
          scalable APIs, and ML-powered experiences.
        </p>
        <div ref={ctaRef} style={{ opacity: 0, display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <a
            href="#projects"
            className="btn btn-red"
            data-magnetic
          >
            View Work ↓
          </a>
          <a
            href="/Kanav-Resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="btn"
            data-magnetic
          >
            Resume ↗
          </a>
        </div>
      </div>

      <div className="hero__scroll-indicator">
        <div className="hero__scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
