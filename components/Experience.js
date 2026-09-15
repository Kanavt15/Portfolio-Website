'use client';
import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const EXPERIENCES = [
  {
    num: '01',
    company: 'Claidroid Technologies',
    role: 'Machine Learning Intern',
    date: 'Dec 2024 – Jul 2025',
    bullets: [
      'Developed and fine-tuned ML models for computer vision and NLP use-cases.',
      'Built data ingestion pipelines handling unstructured datasets at scale.',
      'Integrated trained models into production REST APIs using Flask.',
      'Collaborated with product and engineering teams in an Agile sprint cycle.',
    ],
  },
  {
    num: '02',
    company: 'Central Railway',
    role: 'Technical Intern',
    date: 'Jul 2024 – Aug 2024',
    bullets: [
      'Worked with railway operational data and internal reporting systems.',
      'Assisted in designing SQL-based data queries for efficiency analysis.',
      'Documented technical workflows and contributed to process automation.',
    ],
  },
];

function ExpItem({ item }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef(null);
  const innerRef = useRef(null);

  const toggle = () => {
    if (!open) {
      const h = innerRef.current.scrollHeight;
      gsap.to(bodyRef.current, { height: h, duration: 0.55, ease: 'expo.out' });
    } else {
      gsap.to(bodyRef.current, { height: 0, duration: 0.45, ease: 'expo.in' });
    }
    setOpen(!open);
  };

  return (
    <div className={`exp__item${open ? ' open' : ''}`}>
      <div className="exp__item-header" onClick={toggle} data-hover>
        <div className="exp__item-left">
          <span className="exp__item-num">{item.num}</span>
          <div>
            <div className="exp__item-company">{item.company}</div>
            <div className="exp__item-role">{item.role}</div>
          </div>
        </div>
        <div className="exp__item-right">
          <span className="exp__item-date">{item.date}</span>
          <div className="exp__toggle">+</div>
        </div>
      </div>

      <div className="exp__item-body" ref={bodyRef} style={{ height: 0 }}>
        <div ref={innerRef}>
          <div className="exp__item-body-inner">
            <ul>
              {item.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  const headRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lines = headRef.current?.querySelectorAll('.clip span');
    if (lines?.length) {
      gsap.fromTo(
        lines,
        { y: '110%' },
        {
          y: '0%', stagger: 0.1, duration: 1.1, ease: 'expo.out',
          scrollTrigger: { trigger: headRef.current, start: 'top 82%' },
        }
      );
    }
  }, []);

  return (
    <section className="section experience" id="experience">
      <div className="exp__header">
        <span className="section-label">02 / Experience</span>
        <div ref={headRef}>
          <h2 className="section-heading">
            <span className="clip"><span>WHERE</span></span>
            <span className="clip"><span>I&rsquo;VE <span style={{ color: 'var(--red)' }}>WORKED</span></span></span>
          </h2>
        </div>
      </div>

      <div className="exp__items">
        {EXPERIENCES.map(item => (
          <ExpItem key={item.num} item={item} />
        ))}
      </div>
    </section>
  );
}
