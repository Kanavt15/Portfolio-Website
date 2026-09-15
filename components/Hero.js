'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export default function Hero() {
  const sectionRef = useRef(null);
  const line1Ref   = useRef(null);
  const line2Ref   = useRef(null);
  const subRef     = useRef(null);
  const redLineRef = useRef(null);
  const eyebrowRef = useRef(null);
  const ctaRef     = useRef(null);

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
