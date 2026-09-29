'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * A dramatic preloader / intro animation.
 * Counts up from 0 to 100, then reveals the page with a curtain wipe.
 * Gives a premium first impression.
 */
export default function Preloader({ onComplete }) {
  const preloaderRef = useRef(null);
  const counterRef = useRef(null);
  const nameRef = useRef(null);
  const lineRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete?.();
      },
    });

    // Animate counter from 0 to 100
    const counter = { val: 0 };
    tl.to(counter, {
      val: 100,
      duration: 2,
      ease: 'power2.inOut',
      roundProps: 'val',
      onUpdate: () => setCount(counter.val),
    })
    // Grow the red line
    .to(lineRef.current, {
      width: '100%',
      duration: 2,
      ease: 'power2.inOut',
    }, 0)
    // Fade out counter and name
    .to([counterRef.current, nameRef.current], {
      opacity: 0,
      y: -30,
      duration: 0.4,
      ease: 'power2.in',
    }, '+=0.2')
    // Curtain reveal — slide up
    .to(preloaderRef.current, {
      yPercent: -100,
      duration: 0.8,
      ease: 'expo.inOut',
    }, '-=0.1');

    return () => tl.kill();
  }, [onComplete]);

  return (
    <div className="preloader" ref={preloaderRef}>
      <div className="preloader__content">
        <div className="preloader__name" ref={nameRef}>
          KANAV TRIVEDI
        </div>
        <div className="preloader__counter" ref={counterRef}>
          {String(count).padStart(3, '0')}
        </div>
        <div className="preloader__line-track">
          <div className="preloader__line" ref={lineRef} />
        </div>
      </div>
    </div>
  );
}
