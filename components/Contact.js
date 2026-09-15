'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const LINKS = [
  { label: 'Email',    value: 'kanavtrivedi@email.com',       href: 'mailto:kanavtrivedi@email.com' },
  { label: 'Phone',    value: '+91 8976036164',               href: 'tel:+918976036164' },
  { label: 'LinkedIn', value: 'linkedin.com/in/kanav-trivedi', href: 'https://www.linkedin.com/in/kanav-trivedi/' },
  { label: 'GitHub',   value: 'github.com/Kanavt15',          href: 'https://github.com/Kanavt15' },
];

export default function Contact() {
  const headRef  = useRef(null);
  const linksRef = useRef(null);

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
  }, []);

  return (
    <section className="section contact" id="contact">
      <div>
        <span className="section-label" style={{ display: 'block', marginBottom: '32px' }}>
          06 / Contact
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
