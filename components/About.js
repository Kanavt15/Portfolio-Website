'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const STATS = [
  { num: '9.07', label: 'CGPA / 10' },
  { num: '2',    label: 'Internships' },
  { num: '4',    label: 'Projects' },
  { num: '3',    label: 'Awards' },
];

export default function About() {
  const sectionRef = useRef(null);
  const headRef    = useRef(null);
  const bodyRef    = useRef(null);
  const statsRef   = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Heading lines
    const lines = headRef.current?.querySelectorAll('.clip span');
    if (lines?.length) {
      gsap.fromTo(
        lines,
        { y: '110%' },
        {
          y: '0%',
          stagger: 0.08,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: headRef.current,
            start: 'top 80%',
          },
        }
      );
    }

    // Body text
    gsap.fromTo(
      bodyRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: bodyRef.current, start: 'top 80%' },
      }
    );

    // Stats
    statsRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', delay: i * 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%' },
        }
      );
    });
  }, []);

  return (
    <section className="section about" id="about" ref={sectionRef}>
      <div className="about__grid">
        <div ref={headRef}>
          <h2 className="about__heading">
            <span className="clip">
              <span>I BUILD</span>
            </span>
            <span className="clip">
              <span>THINGS</span>
            </span>
            <span className="clip">
              <span>THAT <em>MATTER</em></span>
            </span>
          </h2>
        </div>

        <div ref={bodyRef} style={{ opacity: 0 }}>
          <p className="about__body">
            I&rsquo;m a Computer Engineering student (Honors in AI &amp; ML) at K. J. Somaiya
            Institute of Technology, Mumbai — graduating 2027 with a 9.07 CGPA.
          </p>
          <p className="about__body">
            My focus lives at the intersection of backend systems, RESTful APIs,
            and machine learning pipelines. I&rsquo;ve shipped production-grade systems at
            Claidroid Technologies and worked with Central Railway on data tooling.
          </p>
          <a href="#contact" className="btn" data-magnetic>
            Get in touch →
          </a>
        </div>
      </div>

      <div className="about__stats">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className="stat"
            ref={el => (statsRef.current[i] = el)}
            style={{ opacity: 0 }}
          >
            <div className="stat__num">{s.num}</div>
            <div className="stat__label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
