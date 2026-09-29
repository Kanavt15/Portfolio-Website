'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';

/**
 * macOS-style floating dock for quick section navigation.
 * Icons magnify as the cursor approaches (fisheye effect).
 * Appears on the right side of the screen after scrolling past the hero.
 */
const DOCK_ITEMS = [
  { id: 'hero',       icon: '⌂', label: 'Home' },
  { id: 'about',      icon: '◉', label: 'About' },
  { id: 'experience', icon: '◈', label: 'Experience' },
  { id: 'projects',   icon: '◆', label: 'Projects' },
  { id: 'skills',     icon: '⚡', label: 'Skills' },
  { id: 'awards',     icon: '★', label: 'Awards' },
  { id: 'contact',    icon: '✉', label: 'Contact' },
];

export default function FloatingDock() {
  const dockRef = useRef(null);
  const itemRefs = useRef([]);
  const [active, setActive] = useState('hero');
  const [visible, setVisible] = useState(false);

  // Track which section is currently in view
  useEffect(() => {
    const observers = [];
    DOCK_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive(item.id);
          }
        },
        { threshold: 0.3, rootMargin: '-10% 0px -10% 0px' }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  // Show/hide dock based on scroll
  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fisheye magnification effect
  const handleMouseMove = useCallback((e) => {
    const dock = dockRef.current;
    if (!dock) return;

    itemRefs.current.forEach((item) => {
      if (!item) return;
      const rect = item.getBoundingClientRect();
      const itemCenterY = rect.top + rect.height / 2;
      const distance = Math.abs(e.clientY - itemCenterY);
      const maxDist = 100;
      const scale = Math.max(1, 1.5 - (distance / maxDist) * 0.5);

      gsap.to(item, {
        scale: distance < maxDist ? scale : 1,
        duration: 0.2,
        ease: 'power2.out',
      });
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    itemRefs.current.forEach((item) => {
      if (!item) return;
      gsap.to(item, { scale: 1, duration: 0.3, ease: 'power2.out' });
    });
  }, []);

  const handleClick = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      className={`floating-dock ${visible ? 'floating-dock--visible' : ''}`}
      ref={dockRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Section navigation"
    >
      {DOCK_ITEMS.map((item, i) => (
        <button
          key={item.id}
          ref={el => (itemRefs.current[i] = el)}
          className={`floating-dock__item ${active === item.id ? 'floating-dock__item--active' : ''}`}
          onClick={() => handleClick(item.id)}
          title={item.label}
          data-hover
        >
          <span className="floating-dock__icon">{item.icon}</span>
          <span className="floating-dock__tooltip">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
