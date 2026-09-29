'use client';
import { useEffect, useState } from 'react';

/**
 * A sleek real-time status bar at the bottom of the hero section.
 * Shows current time in IST, location, and availability status
 * with a pulsing green dot — adds a "live" feel to the site.
 */
export default function StatusLine() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const ist = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);
      setTime(ist);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="status-line" aria-live="polite">
      <div className="status-line__group">
        <span className="status-line__dot status-line__dot--live" />
        <span className="status-line__text">Available for work</span>
      </div>
      <div className="status-line__group">
        <span className="status-line__label">IST</span>
        <span className="status-line__time" suppressHydrationWarning>{time}</span>
      </div>
      <div className="status-line__group">
        <span className="status-line__label">Location</span>
        <span className="status-line__text">Mumbai, IN</span>
      </div>
      <div className="status-line__group">
        <span className="status-line__label">Focus</span>
        <span className="status-line__text">Backend & ML</span>
      </div>
    </div>
  );
}
