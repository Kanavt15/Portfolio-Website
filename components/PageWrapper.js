'use client';
import { useState, useCallback } from 'react';
import Preloader from './Preloader';

/**
 * Client wrapper that manages the preloader lifecycle.
 * Shows the preloader on first load, then reveals children.
 */
export default function PageWrapper({ children }) {
  const [loading, setLoading] = useState(true);

  const handleComplete = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <>
      {loading && <Preloader onComplete={handleComplete} />}
      <div style={{ visibility: loading ? 'hidden' : 'visible' }}>
        {children}
      </div>
    </>
  );
}
