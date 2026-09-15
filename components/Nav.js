'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const NAV_ITEMS = [
  { label: 'About',      href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects',   href: '#projects' },
  { label: 'Skills',     href: '#skills' },
  { label: 'Contact',    href: '#contact' },
];

export default function Nav() {
  const navRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1, ease: 'expo.out', delay: 0.3 }
    );

    // Scroll-based background
    const onScroll = () => {
      const scrolled = window.scrollY > 60;
      if (navRef.current) {
        navRef.current.style.background = scrolled
          ? 'rgba(10,10,10,0.85)'
          : 'transparent';
        navRef.current.style.backdropFilter = scrolled ? 'blur(12px)' : 'none';
        navRef.current.style.transition = 'background 0.4s, backdrop-filter 0.4s';
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="nav" ref={navRef} style={{ opacity: 0 }}>
      <Link href="/" className="nav__logo">
        KT<span>.</span>
      </Link>

      <ul className="nav__links">
        {NAV_ITEMS.map((item) => (
          <li key={item.label}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>

      <a
        href="/Kanav-Resume.pdf"
        target="_blank"
        rel="noreferrer"
        className="btn"
        style={{ padding: '10px 20px', fontSize: '11px' }}
        data-magnetic
      >
        Resume ↗
      </a>
    </nav>
  );
}
