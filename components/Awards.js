'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const AWARDS = [
  {
    num: '01',
    title: '3rd Prize — Tantragyan 2026',
    sub: 'National-level technical fest, K. J. Somaiya Institute of Technology',
    year: '2026',
  },
  {
    num: '02',
    title: '2nd Prize — TECHSPARK-CSI-IT',
    sub: 'Inter-college technical competition organised by CSI',
    year: '2025',
  },
  {
    num: '03',
    title: 'AWS Academy Graduate',
    sub: 'AWS Academy Cloud Foundations & Machine Learning Foundations',
    year: '2024',
  },
  {
    num: '04',
    title: 'Deloitte Certification',
    sub: 'Virtual Experience Programme — Technology & Data Analytics',
    year: '2024',
  },
];

export default function Awards() {
  const headRef  = useRef(null);
  const listRef  = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lines = headRef.current?.querySelectorAll('.clip span');
    if (lines?.length) {
      gsap.fromTo(lines, { y: '110%' }, {
        y: '0%', stagger: 0.1, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 82%' },
      });
    }

    const items = listRef.current?.querySelectorAll('.award-item');
    if (items?.length) {
      gsap.fromTo(items, { opacity: 0, x: -30 }, {
        opacity: 1, x: 0, stagger: 0.1, duration: 0.8, ease: 'expo.out',
        scrollTrigger: { trigger: listRef.current, start: 'top 80%' },
      });
    }
  }, []);

  return (
    <section className="section awards" id="awards">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '0',
        }}
      >
        <span className="section-label">05 / Recognition</span>
        <div ref={headRef}>
          <h2 className="section-heading">
            <span className="clip"><span>AWARDS &amp;</span></span>
            <br />
            <span className="clip">
              <span><span style={{ color: 'var(--red)' }}>CERTS</span></span>
            </span>
          </h2>
        </div>
      </div>

      <div className="awards__list" ref={listRef}>
        {AWARDS.map((a) => (
          <div className="award-item" key={a.num} style={{ opacity: 0 }}>
            <span className="award-item__num">{a.num}</span>
            <div className="award-item__content">
              <div className="award-item__title">{a.title}</div>
              <div className="award-item__sub">{a.sub}</div>
            </div>
            <span className="award-item__year">{a.year}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
