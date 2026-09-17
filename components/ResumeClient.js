'use client';
import dynamic from 'next/dynamic';

const ResumeDynamic = dynamic(() => import('./Resume'), {
  ssr: false,
  loading: () => (
    <div style={{
      padding: '60px',
      color: '#888',
      fontSize: '13px',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    }}>
      Loading resume…
    </div>
  ),
});

export default ResumeDynamic;
