'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const PROJECTS = [
  {
    num: '01',
    name: 'Skill-Verse',
    desc: 'A full-stack skill-exchange platform where users list skills they offer and request skills they need. Built with Node.js, Express.js, and MySQL — complete with session auth, search, and match-making logic.',
    tags: ['Node.js', 'Express.js', 'MySQL', 'REST API', 'EJS'],
    url: '#',
  },
  {
    num: '02',
    name: 'SSTC',
    desc: 'A MERN-stack smart study time calculator that analyses subject difficulty, credit hours, and exam schedules to generate personalised revision timetables — deployed with JWT authentication.',
    tags: ['MongoDB', 'Express', 'React', 'Node.js', 'JWT'],
    url: '#',
  },
  {
    num: '03',
    name: 'ReFace',
    desc: 'Real-time facial re-texture desktop app built on Electron.js, Python (MediaPipe), and Three.js. Leverages Blender for 3D mesh generation and live-streams modified video through WebGL.',
    tags: ['Electron', 'Three.js', 'Python', 'Blender', 'MediaPipe'],
    url: '#',
  },
  {
    num: '04',
    name: 'CAD-C',
    desc: 'A TensorFlow-based cancer-cell anomaly detector trained on microscopy image datasets. Achieved 94 % accuracy using custom CNN architectures with augmentation pipelines.',
    tags: ['Python', 'TensorFlow', 'CNN', 'OpenCV', 'NumPy'],
    url: '#',
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
            <br />
            <span className="clip"><span><span style={{ color: 'var(--red)' }}>WORK</span></span></span>
          </h2>
        </div>
      </div>

      <div className="projects__grid">
        {PROJECTS.map((p, i) => (
          <div
            key={p.num}
            className="project-card"
            ref={el => (cardsRef.current[i] = el)}
            style={{ opacity: 0 }}
          >
            <div className="project-card__inner">
              <div className="project-card__top">
                <span className="project-card__num">{p.num}</span>
                <h3 className="project-card__name">{p.name}</h3>
              </div>

              <div>
                <p className="project-card__desc">{p.desc}</p>
                <div className="project-card__footer">
                  {p.tags.map(t => (
                    <span className="tag" key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="project-card__arrow">↗</div>
          </div>
        ))}
      </div>
    </section>
  );
}
