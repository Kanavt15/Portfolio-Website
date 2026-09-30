'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import TextScramble from './TextScramble';

/* ─── Skill → project + info mapping ──────────────────────── */
const PROJECTS = [
  { name: 'ReFace',      tags: ['Electron', 'Three.js', 'Python', 'Blender', 'MediaPipe'], url: 'https://github.com/Kanavt15/reface-id' },
  { name: 'Vanaspati',   tags: ['React', 'Three.js', 'TypeScript', 'Vite', 'Tailwind', 'Zustand'], url: 'https://github.com/Kanavt15/virtual-herbal-garden' },
  { name: 'Skill-Verse', tags: ['Node.js', 'Express.js', 'MySQL', 'REST API', 'EJS'], url: 'https://github.com/Kanavt15/SkillVerse' },
  { name: 'CAD-C',       tags: ['Python', 'TensorFlow', 'CNN', 'OpenCV', 'NumPy'], url: 'https://github.com/Kanavt15/CAD-C' },
  { name: 'SSTC',        tags: ['MongoDB', 'Express', 'React', 'Node.js', 'JWT'], url: 'https://github.com/Kanavt15/SSTC' },
];

const SKILLS = [
  {
    name: 'C / C++',
    cat: 'Languages',
    icon: 'cplusplus',
    desc: 'Systems programming language for high-performance computing, embedded systems, and competitive programming. Known for fine-grained memory control.',
    usedIn: [],
    level: 85,
    since: '2021',
  },
  {
    name: 'JavaScript',
    cat: 'Languages',
    icon: 'javascript',
    desc: 'The language of the web. Used for full-stack development from dynamic frontends to server-side Node.js applications and RESTful APIs.',
    usedIn: ['Vanaspati', 'Skill-Verse', 'SSTC'],
    level: 92,
    since: '2022',
  },
  {
    name: 'Python',
    cat: 'Languages',
    icon: 'python',
    desc: 'Versatile scripting language favoured for ML pipelines, data processing, and backend automation. Primary language for AI/ML work.',
    usedIn: ['ReFace', 'CAD-C'],
    level: 90,
    since: '2021',
  },
  {
    name: 'SQL',
    cat: 'Languages',
    icon: 'mysql',
    desc: 'Structured Query Language for relational database management. Used for complex joins, stored procedures, and database design.',
    usedIn: ['Skill-Verse'],
    level: 80,
    since: '2022',
  },
  {
    name: 'Node.js',
    cat: 'Backend',
    icon: 'nodedotjs',
    desc: 'JavaScript runtime built on V8 for building scalable server-side applications. Powers REST APIs, real-time services, and microservices.',
    usedIn: ['Skill-Verse', 'SSTC'],
    level: 88,
    since: '2022',
  },
  {
    name: 'Express.js',
    cat: 'Backend',
    icon: 'express',
    desc: 'Minimalist web framework for Node.js. Used for building RESTful APIs, middleware pipelines, and MVC web applications.',
    usedIn: ['Skill-Verse', 'SSTC'],
    level: 86,
    since: '2022',
  },
  {
    name: 'REST APIs',
    cat: 'Backend',
    icon: null,
    desc: 'Architectural style for distributed hypermedia systems. Designed and consumed RESTful services with proper auth, versioning, and error handling.',
    usedIn: ['Skill-Verse', 'SSTC'],
    level: 88,
    since: '2022',
  },
  {
    name: 'React',
    cat: 'Frontend',
    icon: 'react',
    desc: 'Component-based UI library for building interactive single-page applications. Used with hooks, context, and modern patterns.',
    usedIn: ['Vanaspati', 'SSTC'],
    level: 85,
    since: '2022',
  },
  {
    name: 'Next.js',
    cat: 'Frontend',
    icon: 'nextdotjs',
    desc: 'React framework with SSR, SSG, file-based routing, and API routes. This very portfolio is built with Next.js 16 + Turbopack.',
    usedIn: [],
    level: 82,
    since: '2023',
  },
  {
    name: 'MongoDB',
    cat: 'Database',
    icon: 'mongodb',
    desc: 'Document-oriented NoSQL database. Used for flexible schema design, aggregation pipelines, and rapid prototyping.',
    usedIn: ['SSTC'],
    level: 78,
    since: '2023',
  },
  {
    name: 'MySQL',
    cat: 'Database',
    icon: 'mysql',
    desc: 'Relational DBMS with ACID compliance. Used for complex relational data models, joins, and transactional systems.',
    usedIn: ['Skill-Verse'],
    level: 80,
    since: '2022',
  },
  {
    name: 'PostgreSQL',
    cat: 'Database',
    icon: 'postgresql',
    desc: 'Advanced open-source RDBMS with powerful extensions. Preferred for production-grade applications needing JSON support and full-text search.',
    usedIn: [],
    level: 70,
    since: '2023',
  },
  {
    name: 'TensorFlow',
    cat: 'AI / ML',
    icon: 'tensorflow',
    desc: 'End-to-end ML platform for building and deploying neural networks. Used for CNN training, model serving, and production ML pipelines.',
    usedIn: ['CAD-C'],
    level: 82,
    since: '2022',
  },
  {
    name: 'PyTorch',
    cat: 'AI / ML',
    icon: 'pytorch',
    desc: 'Dynamic computation graph framework for research-driven deep learning. Used for rapid experimentation and custom layer design.',
    usedIn: [],
    level: 75,
    since: '2023',
  },
  {
    name: 'Scikit-learn',
    cat: 'AI / ML',
    icon: 'scikitlearn',
    desc: 'Machine learning library for classical algorithms — SVMs, random forests, clustering, and preprocessing pipelines.',
    usedIn: [],
    level: 78,
    since: '2022',
  },
  {
    name: 'AWS Cloud',
    cat: 'Cloud',
    icon: 'aws',
    desc: 'Amazon Web Services platform for cloud infrastructure. Experienced with EC2, S3, Lambda, and deployment workflows.',
    usedIn: [],
    level: 68,
    since: '2023',
  },
  {
    name: 'Git / GitHub',
    cat: 'Tools',
    icon: 'git',
    desc: 'Version control system for collaborative software development. Used for branching strategies, PRs, CI workflows, and open-source contribution.',
    usedIn: ['ReFace', 'Vanaspati', 'Skill-Verse', 'CAD-C', 'SSTC'],
    level: 90,
    since: '2021',
  },
  {
    name: 'Docker',
    cat: 'Tools',
    icon: 'docker',
    desc: 'Container platform for packaging applications with all their dependencies. Used for reproducible dev environments and deployment.',
    usedIn: [],
    level: 72,
    since: '2023',
  },
  {
    name: 'Linux',
    cat: 'Tools',
    icon: 'linux',
    desc: 'Unix-based OS environment for development and server administration. Comfortable with bash scripting, process management, and SSH.',
    usedIn: [],
    level: 78,
    since: '2021',
  },
  {
    name: 'Three.js',
    cat: 'Tools',
    icon: 'threedotjs',
    desc: 'WebGL-based 3D graphics library. Used for procedural 3D generation, real-time rendering, and interactive 3D experiences in the browser.',
    usedIn: ['ReFace', 'Vanaspati'],
    level: 80,
    since: '2023',
  },
];

/* ─── Custom SVG icons ────────────────────────────────────── */
function ApiIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
      <circle cx="8" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="16" cy="18" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function AwsIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.032-.863.104-.296.072-.583.16-.863.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.44.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.152 0 .256.024.32.08.063.048.112.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.152-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.024.32.08.064.048.12.16.152.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .32-.08h.743c.128 0 .2.064.2.2 0 .04-.008.08-.016.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.264-.168.312a.549.549 0 0 1-.32.08h-.687c-.152 0-.256-.024-.32-.08-.063-.056-.12-.16-.151-.32l-1.238-5.148-1.23 5.14c-.04.16-.088.272-.152.328-.064.048-.176.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.216-.151-.248-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.415-.287-.807-.414l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.176 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.072-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.16.152.454.304.87.44l1.134.358c.574.184.99.44 1.237.767.248.327.375.702.375 1.118 0 .344-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167z" />
      <path d="M21.725 16.166C19.127 18.14 15.354 19.2 12.104 19.2c-4.548 0-8.644-1.683-11.74-4.479-.243-.22-.025-.52.267-.349 3.344 1.943 7.478 3.115 11.75 3.115 2.88 0 6.049-.598 8.963-1.834.44-.191.808.287.38.513z" />
      <path d="M22.853 14.87c-.332-.424-2.19-.2-3.024-.1-.254.032-.293-.19-.064-.35 1.482-1.04 3.91-.74 4.192-.392.283.356-.074 2.816-1.464 3.99-.213.18-.417.084-.322-.154.312-.782 1.013-2.57.682-2.994z" />
    </svg>
  );
}

const CUSTOM_ICONS = { aws: AwsIcon };

/* ─── Level bar component ─────────────────────────────────── */
function LevelBar({ level, animated }) {
  const barRef = useRef(null);
  useEffect(() => {
    if (!animated || !barRef.current) return;
    gsap.fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'expo.out', delay: 0.1 });
  }, [animated]);
  return (
    <div className="sk-panel__level-track">
      <div className="sk-panel__level-fill" ref={barRef} style={{ '--level': `${level}%` }} />
    </div>
  );
}

/* ─── Skill panel (expanded drawer) ──────────────────────── */
function SkillPanel({ skill, onClose }) {
  const panelRef = useRef(null);
  const [animReady, setAnimReady] = useState(false);

  const usedProjects = PROJECTS.filter(p =>
    skill.usedIn.includes(p.name)
  );

  useEffect(() => {
    if (!panelRef.current) return;
    gsap.fromTo(panelRef.current,
      { opacity: 0, y: 20, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'expo.out',
        onComplete: () => setAnimReady(true) }
    );
  }, []);

  const close = useCallback(() => {
    if (!panelRef.current) { onClose(); return; }
    gsap.to(panelRef.current, {
      opacity: 0, y: 12, scale: 0.97, duration: 0.25, ease: 'power2.in',
      onComplete: onClose,
    });
  }, [onClose]);

  return (
    <div className="sk-panel" ref={panelRef} onClick={e => e.stopPropagation()}>
      {/* Close */}
      <button className="sk-panel__close" onClick={close} aria-label="Close">✕</button>

      {/* Header */}
      <div className="sk-panel__header">
        <div className="sk-panel__icon-wrap">
          {skill.icon === null ? (
            <ApiIcon className="sk-panel__icon sk-panel__icon--svg" />
          ) : CUSTOM_ICONS[skill.icon] ? (
            (() => { const Icon = CUSTOM_ICONS[skill.icon]; return <Icon className="sk-panel__icon sk-panel__icon--svg" />; })()
          ) : (
            <img src={`https://cdn.simpleicons.org/${skill.icon}/f0ede6`} alt={skill.name} width={36} height={36} />
          )}
        </div>
        <div>
          <div className="sk-panel__name">{skill.name}</div>
          <div className="sk-panel__cat">{skill.cat} · Since {skill.since}</div>
        </div>
      </div>

      {/* Proficiency bar */}
      <div className="sk-panel__level-label">
        <span>Proficiency</span>
        <span className="sk-panel__level-num">{skill.level}%</span>
      </div>
      <LevelBar level={skill.level} animated={animReady} />

      {/* Description */}
      <p className="sk-panel__desc">{skill.desc}</p>

      {/* Projects */}
      <div className="sk-panel__projects-label">
        {usedProjects.length > 0 ? 'Used in' : 'Not yet used in a featured project'}
      </div>
      {usedProjects.length > 0 && (
        <div className="sk-panel__projects">
          {usedProjects.map(p => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="sk-panel__project-chip"
              data-hover
            >
              <span className="sk-panel__project-chip-dot" />
              {p.name}
              <span className="sk-panel__project-chip-arrow">↗</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Skills component ───────────────────────────────── */
export default function Skills() {
  const gridRef = useRef(null);
  const headRef = useRef(null);
  const cardsRef = useRef([]);
  const [activeSkill, setActiveSkill] = useState(null);
  const overlayRef = useRef(null);

  // 3D tilt
  const handleMouseMove = useCallback((e, index) => {
    const card = cardsRef.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    card.style.setProperty('--rotate-x', `${((y - cy) / cy) * -7}deg`);
    card.style.setProperty('--rotate-y', `${((x - cx) / cx) * 7}deg`);
    card.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
  }, []);

  const handleMouseLeave = useCallback((index) => {
    const card = cardsRef.current[index];
    if (!card) return;
    card.style.setProperty('--rotate-x', '0deg');
    card.style.setProperty('--rotate-y', '0deg');
  }, []);

  const openPanel = useCallback((skill) => {
    setActiveSkill(skill);
  }, []);

  const closePanel = useCallback(() => {
    setActiveSkill(null);
  }, []);

  // Close on overlay click
  useEffect(() => {
    if (!overlayRef.current) return;
    const el = overlayRef.current;
    if (activeSkill) {
      gsap.to(el, { opacity: 1, duration: 0.3, pointerEvents: 'all' });
    } else {
      gsap.to(el, { opacity: 0, duration: 0.2, pointerEvents: 'none' });
    }
  }, [activeSkill]);

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
      gsap.fromTo(items, { opacity: 0, y: 50, scale: 0.85 }, {
        opacity: 1, y: 0, scale: 1,
        stagger: { each: 0.05, from: 'random' },
        duration: 0.9,
        ease: 'expo.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
      });
    }
  }, []);

  return (
    <section className="section skills" id="skills" style={{ position: 'relative' }}>
      {/* Backdrop overlay when panel open */}
      <div
        className="sk-overlay"
        ref={overlayRef}
        onClick={closePanel}
        style={{ opacity: 0, pointerEvents: 'none' }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 0 }}>
        <span className="section-label">
          <TextScramble text="04 / Skills" className="section-label" />
        </span>
        <div ref={headRef}>
          <h2 className="section-heading">
            <span className="clip"><span>MY</span></span>
            <span className="clip"><span><span style={{ color: 'var(--red)' }}>TOOLKIT</span></span></span>
          </h2>
        </div>
      </div>

      {/* Click-hint */}
      <p className="skills__hint">Click any card to explore details &amp; projects →</p>

      <div className="skills__grid" ref={gridRef}>
        {SKILLS.map((s, index) => (
          <div
            className={`skill-item ${activeSkill?.name === s.name ? 'skill-item--active' : ''}`}
            key={s.name}
            style={{ opacity: 0 }}
            data-hover
            ref={(el) => (cardsRef.current[index] = el)}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={() => handleMouseLeave(index)}
            onClick={() => openPanel(s)}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${s.name}`}
          >
            <div className="skill-item__shimmer" />
            <div className="skill-item__spotlight" />

            <div className="skill-item__icon-wrap">
              {s.icon === null ? (
                <ApiIcon className="skill-item__icon skill-item__icon--svg" />
              ) : CUSTOM_ICONS[s.icon] ? (
                (() => { const Icon = CUSTOM_ICONS[s.icon]; return <Icon className="skill-item__icon skill-item__icon--svg" />; })()
              ) : (
                <img className="skill-item__icon" src={`https://cdn.simpleicons.org/${s.icon}/f0ede6`} alt={s.name} width={28} height={28} loading="lazy" />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="skill-item__name">{s.name}</div>
              <div className="skill-item__cat">{s.cat}</div>
            </div>
            {/* Project count badge */}
            {s.usedIn.length > 0 && (
              <div className="skill-item__badge" title={`Used in ${s.usedIn.length} project${s.usedIn.length > 1 ? 's' : ''}`}>
                {s.usedIn.length}
              </div>
            )}
            {/* Click indicator */}
            <div className="skill-item__click-hint">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Skill detail panel */}
      {activeSkill && (
        <SkillPanel skill={activeSkill} onClose={closePanel} />
      )}
    </section>
  );
}
