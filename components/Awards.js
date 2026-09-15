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
    url: 'https://drive.google.com/file/d/1S4RQ6Z-Ol5Y2W3bbxxkXdr03ep6w0mGG/view',
  },
  {
    num: '02',
    title: '2nd Prize — TECHSPARK-CSI-IT',
    sub: 'Inter-college technical competition organised by CSI',
    year: '2025',
    url: 'https://drive.google.com/file/d/1XT6qzjJOQbJ3V1K_S5JwvREl_QAak5ZV/view',
  },
  {
    num: '03',
    title: 'AWS Academy Graduate',
    sub: 'AWS Academy Cloud Foundations & Machine Learning Foundations',
    year: '2024',
    url: 'https://drive.google.com/file/d/1j35Lc63Fx_GA3q57W0WmB5GOJyFAG_0v/view',
  },
  {
    num: '04',
    title: 'GenW.AI Explorer — Level 1',
    sub: 'Generative AI certification, Google for Developers',
    year: '2024',
    url: 'https://drive.google.com/file/d/1HEpwlpOyAt1UCPms9MxyRvoWI_YWWwh4/view',
  },
];

export default function Awards() {
  const headRef = useRef(null);
  const listRef = useRef(null);

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
            <span className="clip">
              <span><span style={{ color: 'var(--red)' }}>CERTS</span></span>
            </span>
          </h2>
        </div>
      </div>

      <div className="awards__list" ref={listRef}>
        {AWARDS.map((a) => (
          <a
            key={a.num}
            href={a.url}
            target="_blank"
            rel="noreferrer"
            className="award-item"
            style={{ opacity: 0, textDecoration: 'none' }}
          >
            <span className="award-item__num">{a.num}</span>
            <div className="award-item__content">
              <div className="award-item__title">{a.title}</div>
              <div className="award-item__sub">{a.sub}</div>
            </div>
            <span className="award-item__year">{a.year}</span>
            <span className="award-item__cert-link">
              View Certificate ↗
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
