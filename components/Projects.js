'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const PROJECTS = [
  {
    num: '01',
    name: 'ReFace',
    desc: 'Real-time facial re-texture desktop app built on Electron.js, Python (MediaPipe), and Three.js. Leverages Blender for 3D mesh generation and live-streams modified video through WebGL.',
    tags: ['Electron', 'Three.js', 'Python', 'Blender', 'MediaPipe'],
    url: 'https://github.com/Kanavt15/reface-id',
  },
  {
    num: '02',
    name: 'Vanaspati',
    desc: 'An interactive 3D garden of 25 AYUSH medicinal plants — 6 themed beds, 6 guided tours, and a full Ayurvedic compendium. Every plant is procedurally generated at runtime from botanical data: no downloaded models, no textures, no Blender. Built for Smart India Hackathon.',
    tags: ['React 19', 'Three.js', 'TypeScript', 'Vite', 'Tailwind', 'Zustand'],
    url: 'https://github.com/Kanavt15/virtual-herbal-garden',
    demo: 'https://tushar-surti.github.io/virtual-herbal-garden/',
  },
  {
    num: '03',
    name: 'Skill-Verse',
    desc: 'A full-stack skill-exchange platform where users list skills they offer and request skills they need. Built with Node.js, Express.js, and MySQL — complete with session auth, search, and match-making logic.',
    tags: ['Node.js', 'Express.js', 'MySQL', 'REST API', 'EJS'],
    url: 'https://github.com/Kanavt15/SkillVerse',
  },
  {
    num: '04',
    name: 'CAD-C',
    desc: 'A TensorFlow-based cancer-cell anomaly detector trained on microscopy image datasets. Achieved 94% accuracy using custom CNN architectures with augmentation pipelines.',
    tags: ['Python', 'TensorFlow', 'CNN', 'OpenCV', 'NumPy'],
    url: 'https://github.com/Kanavt15/CAD-C',
    demo: 'https://huggingface.co/spaces/kanavt/CAD-C',
  },
  {
    num: '05',
    name: 'SSTC',
    desc: 'A MERN-stack smart study time calculator that analyses subject difficulty, credit hours, and exam schedules to generate personalised revision timetables — deployed with JWT authentication.',
    tags: ['MongoDB', 'Express', 'React', 'Node.js', 'JWT'],
    url: 'https://github.com/Kanavt15/SSTC',
  },
];

export default function Projects() {
  const headRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lines = headRef.current?.querySelectorAll('.clip span');
    if (lines?.length) {
      gsap.fromTo(lines, { y: '110%' }, {
        y: '0%', stagger: 0.1, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 82%' },
      });
    }

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(card, { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', delay: i * 0.06,
        scrollTrigger: { trigger: card, start: 'top 88%' },
      });
    });
  }, []);

  return (
    <section className="section projects" id="projects">
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '60px',
        }}
      >
        <span className="section-label">03 / Projects</span>
        <div ref={headRef}>
          <h2 className="section-heading">
            <span className="clip"><span>SELECTED</span></span>
            <span className="clip"><span><span style={{ color: 'var(--red)' }}>WORK</span></span></span>
          </h2>
        </div>
      </div>

      <div className="projects__grid">
        {PROJECTS.map((p, i) => (
          <a
            key={p.num}
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="project-card"
            ref={el => (cardsRef.current[i] = el)}
            style={{ opacity: 0, display: 'block' }}
          >
            {/* Arrow — rendered first, sits absolute top-right via CSS z-index 2 */}
            <div className="project-card__arrow">↗</div>

            <div className="project-card__inner">
              {/* Num stacks above Name (flex-column) */}
              <div className="project-card__top">
                <span className="project-card__num">{p.num}</span>
                <h3 className="project-card__name">{p.name}</h3>
              </div>

              {/* Description + tags — revealed on hover */}
              <div>
                <p className="project-card__desc">{p.desc}</p>
                <div className="project-card__footer">
                  {p.tags.map(t => (
                    <span className="tag" key={t}>{t}</span>
                  ))}
                  {p.demo && (
                    <a
                      href={p.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="project-demo-chip"
                      onClick={e => e.stopPropagation()}
                    >
                      ▶ Try it live
                    </a>
                  )}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* More on GitHub */}
      <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
        <a
          href="https://github.com/Kanavt15"
          target="_blank"
          rel="noreferrer"
          className="btn"
          data-magnetic
          style={{ gap: '14px' }}
        >
          More on GitHub
          <span style={{ fontSize: '18px', lineHeight: 1 }}>↗</span>
        </a>
      </div>
    </section>
  );
}
