'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const SKILLS = [
  { name: 'C / C++',      cat: 'Languages' },
  { name: 'JavaScript',   cat: 'Languages' },
  { name: 'Python',       cat: 'Languages' },
  { name: 'SQL',          cat: 'Languages' },
  { name: 'Node.js',      cat: 'Backend' },
  { name: 'Express.js',   cat: 'Backend' },
  { name: 'REST APIs',    cat: 'Backend' },
  { name: 'React',        cat: 'Frontend' },
  { name: 'Next.js',      cat: 'Frontend' },
  { name: 'MongoDB',      cat: 'Database' },
  { name: 'MySQL',        cat: 'Database' },
  { name: 'PostgreSQL',   cat: 'Database' },
  { name: 'TensorFlow',   cat: 'AI / ML' },
  { name: 'PyTorch',      cat: 'AI / ML' },
  { name: 'Scikit-learn', cat: 'AI / ML' },
  { name: 'AWS Cloud',    cat: 'Cloud' },
  { name: 'Git / GitHub', cat: 'Tools' },
  { name: 'Docker',       cat: 'Tools' },
  { name: 'Linux',        cat: 'Tools' },
  { name: 'Three.js',     cat: 'Tools' },
];

export default function Skills() {
  const gridRef   = useRef(null);
  const headRef   = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lines = headRef.current?.querySelectorAll('.clip span');
    if (lines?.length) {
      gsap.fromTo(lines, { y: '110%' }, {
        y: '0%', stagger: 0.1, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 82%' },
      });
    }

    const items = gridRef.current?.querySelectorAll('.skill-item');
    if (items?.length) {
      gsap.fromTo(items, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0,
        stagger: { each: 0.04, from: 'start' },
        duration: 0.7,
        ease: 'expo.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
      });
    }
  }, []);

  return (
    <section className="section skills" id="skills">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 0,
        }}
      >
        <span className="section-label">04 / Skills</span>
        <div ref={headRef}>
          <h2 className="section-heading">
            <span className="clip"><span>MY</span></span>
            <span className="clip"><span><span style={{ color: 'var(--red)' }}>TOOLKIT</span></span></span>
          </h2>
        </div>
      </div>

      <div className="skills__grid" ref={gridRef}>
        {SKILLS.map((s) => (
          <div className="skill-item" key={s.name} style={{ opacity: 0 }}>
            <div className="skill-item__name">{s.name}</div>
            <div className="skill-item__cat">{s.cat}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
