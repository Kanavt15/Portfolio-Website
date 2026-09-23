'use client';
import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const LINKS = [
  { label: 'Email',    value: 'kanavtrivedi@email.com',       href: 'mailto:kanavtrivedi@email.com' },
  { label: 'Phone',    value: '+91 8976036164',               href: 'tel:+918976036164' },
  { label: 'LinkedIn', value: 'linkedin.com/in/kanav-trivedi', href: 'https://www.linkedin.com/in/kanav-trivedi/' },
  { label: 'GitHub',   value: 'github.com/Kanavt15',          href: 'https://github.com/Kanavt15' },
];

const NAME_TEXT = 'KANAV TRIVEDI';

export default function Contact() {
  const headRef  = useRef(null);
  const linksRef = useRef(null);
  const nameRef  = useRef(null);
  const charRefs = useRef([]);

  const handleCharHover = useCallback((index) => {
    const el = charRefs.current[index];
    if (!el || el.dataset.animating === 'true') return;
    el.dataset.animating = 'true';

    // Main character: jump + color flash + scale + rotate
    gsap.timeline({
      onComplete: () => { el.dataset.animating = 'false'; }
    })
      .to(el, {
        y: -35,
        scale: 1.4,
        rotation: gsap.utils.random(-12, 12),
        color: '#e8001d',
        opacity: 1,
        duration: 0.35,
        ease: 'back.out(3)',
      })
      .to(el, {
        y: 0,
        scale: 1,
        rotation: 0,
        color: '',
        opacity: '',
        duration: 0.9,
        ease: 'elastic.out(1, 0.2)',
      });

    // Wave propagation to neighbors — wider and longer
    const neighbors = [
      { offset: -1, delay: 0.05, intensity: 0.85 },
      { offset: 1,  delay: 0.05, intensity: 0.85 },
      { offset: -2, delay: 0.10, intensity: 0.6 },
      { offset: 2,  delay: 0.10, intensity: 0.6 },
      { offset: -3, delay: 0.15, intensity: 0.4 },
      { offset: 3,  delay: 0.15, intensity: 0.4 },
      { offset: -4, delay: 0.20, intensity: 0.2 },
      { offset: 4,  delay: 0.20, intensity: 0.2 },
      { offset: -5, delay: 0.25, intensity: 0.1 },
      { offset: 5,  delay: 0.25, intensity: 0.1 },
    ];

    neighbors.forEach(({ offset, delay, intensity }) => {
      const neighbor = charRefs.current[index + offset];
      if (!neighbor || neighbor.dataset.char === ' ') return;

      gsap.timeline({ delay })
        .to(neighbor, {
          y: -20 * intensity,
          scale: 1 + 0.25 * intensity,
          color: `rgba(232, 0, 29, ${intensity})`,
          duration: 0.3,
          ease: 'power2.out',
        })
        .to(neighbor, {
          y: 0,
          scale: 1,
          color: '',
          duration: 0.7,
          ease: 'elastic.out(1, 0.3)',
        });
    });
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lines = headRef.current?.querySelectorAll('.clip span');
    if (lines?.length) {
      gsap.fromTo(lines, { y: '110%' }, {
        y: '0%', stagger: 0.12, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 82%' },
      });
    }

    gsap.fromTo(linksRef.current, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.9, ease: 'expo.out',
      scrollTrigger: { trigger: linksRef.current, start: 'top 85%' },
    });

    // Animate name characters on scroll into view
    if (nameRef.current) {
      const chars = nameRef.current.querySelectorAll('.footer-name__char');
      gsap.fromTo(chars,
        { opacity: 0, y: 40 },
        {
          opacity: 0.08,
          y: 0,
          stagger: 0.04,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: { trigger: nameRef.current, start: 'top 90%' },
        }
      );
    }
  }, []);

  return (
    <section className="section contact" id="contact">
      <div>
        <span className="section-label" style={{ display: 'block', marginBottom: '32px' }}>
          08 / Contact
        </span>

        <h2 className="contact__heading" ref={headRef}>
          <span className="contact__heading-line clip">
            <span>LET&rsquo;S</span>
          </span>
          <span className="contact__heading-line clip">
            <span><span style={{ color: 'var(--red)' }}>TALK.</span></span>
          </span>
        </h2>

        <div className="contact__links" ref={linksRef} style={{ opacity: 0 }}>
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="contact__link"
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              data-magnetic
            >
              <span className="contact__link-label">{l.label}</span>
              <span className="contact__link-value">{l.value}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Interactive name watermark */}
      <div className="footer-name" ref={nameRef} aria-hidden="true">
        {NAME_TEXT.split('').map((char, i) => (
          <span
            key={i}
            className={`footer-name__char${char === ' ' ? ' footer-name__char--space' : ''}`}
            ref={(el) => (charRefs.current[i] = el)}
            data-char={char}
            onMouseEnter={() => handleCharHover(i)}
            style={{ opacity: 0 }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>

      <div className="contact__footer-bar">
        <p className="contact__copy">© 2026 Kanav Trivedi — All rights reserved</p>
        <p className="contact__made">Designed &amp; built by Kanav Trivedi</p>
        <a href="#hero" className="btn" data-magnetic style={{ fontSize: '11px', padding: '10px 20px' }}>
          Back to top ↑
        </a>
      </div>
    </section>
  );
}
