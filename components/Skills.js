'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const SKILLS = [
  { name: 'C / C++',      cat: 'Languages', icon: 'cplusplus' },
  { name: 'JavaScript',   cat: 'Languages', icon: 'javascript' },
  { name: 'Python',       cat: 'Languages', icon: 'python' },
  { name: 'SQL',          cat: 'Languages', icon: 'mysql' },
  { name: 'Node.js',      cat: 'Backend',   icon: 'nodedotjs' },
  { name: 'Express.js',   cat: 'Backend',   icon: 'express' },
  { name: 'REST APIs',    cat: 'Backend',   icon: null },
  { name: 'React',        cat: 'Frontend',  icon: 'react' },
  { name: 'Next.js',      cat: 'Frontend',  icon: 'nextdotjs' },
  { name: 'MongoDB',      cat: 'Database',  icon: 'mongodb' },
  { name: 'MySQL',        cat: 'Database',  icon: 'mysql' },
  { name: 'PostgreSQL',   cat: 'Database',  icon: 'postgresql' },
  { name: 'TensorFlow',   cat: 'AI / ML',   icon: 'tensorflow' },
  { name: 'PyTorch',      cat: 'AI / ML',   icon: 'pytorch' },
  { name: 'Scikit-learn', cat: 'AI / ML',   icon: 'scikitlearn' },
  { name: 'AWS Cloud',    cat: 'Cloud',     icon: 'amazonaws' },
  { name: 'Git / GitHub', cat: 'Tools',     icon: 'git' },
  { name: 'Docker',       cat: 'Tools',     icon: 'docker' },
  { name: 'Linux',        cat: 'Tools',     icon: 'linux' },
  { name: 'Three.js',     cat: 'Tools',     icon: 'threedotjs' },
];

/* Custom API icon SVG for REST APIs */
function ApiIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
      <circle cx="8" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="16" cy="18" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Skills() {
  const gridRef = useRef(null);
  const headRef = useRef(null);

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
          <div className="skill-item" key={s.name} style={{ opacity: 0 }} data-hover>
            <div className="skill-item__icon-wrap">
              {s.icon ? (
                <img
                  className="skill-item__icon"
                  src={`https://cdn.simpleicons.org/${s.icon}/f0ede6`}
                  alt={s.name}
                  width={28}
                  height={28}
                  loading="lazy"
                />
              ) : (
                <ApiIcon className="skill-item__icon skill-item__icon--svg" />
              )}
            </div>
            <div>
              <div className="skill-item__name">{s.name}</div>
              <div className="skill-item__cat">{s.cat}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
