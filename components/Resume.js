'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Point pdfjs worker to the CDN build (no extra webpack config needed)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function Resume() {
  const headRef   = useRef(null);
  const wrapRef   = useRef(null);
  const [numPages, setNumPages]     = useState(null);
  const [containerW, setContainerW] = useState(900);

  // Measure container width so PDF fills it exactly
  const measureRef = useCallback(node => {
    if (!node) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerW(entry.contentRect.width);
    });
    ro.observe(node);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lines = headRef.current?.querySelectorAll('.clip span');
    if (lines?.length) {
      gsap.fromTo(lines, { y: '110%' }, {
        y: '0%', stagger: 0.1, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 82%' },
      });
    }
    gsap.fromTo(wrapRef.current, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: wrapRef.current, start: 'top 82%' },
    });
  }, []);

  return (
    <section className="section resume-section" id="resume">
      {/* Header */}
      <div className="resume-section__header">
        <span className="section-label">07 / Resume</span>
        <div ref={headRef}>
          <h2 className="section-heading">
            <span className="clip"><span>MY</span></span>
            <span className="clip">
              <span style={{ color: 'var(--red)' }}>RESUME</span>
            </span>
          </h2>
        </div>
      </div>

      {/* PDF preview */}
      <div
        className="resume-pdf-wrap"
        ref={node => { wrapRef.current = node; measureRef(node); }}
        style={{ opacity: 0 }}
      >
        <div className="resume-pdf-accent" />

        <Document
          file="/Kanav-Resume.pdf"
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={
            <div className="resume-pdf-loading">
              <span className="resume-pdf-loading__dot" />
              Loading resume…
            </div>
          }
          error={
            <div className="resume-pdf-loading">
              Could not load PDF —&nbsp;
              <a href="/Kanav-Resume.pdf" target="_blank" rel="noreferrer" style={{ color: 'var(--red)' }}>
                open directly ↗
              </a>
            </div>
          }
        >
          {numPages &&
            Array.from({ length: numPages }, (_, i) => (
              <Page
                key={`page_${i + 1}`}
                pageNumber={i + 1}
                width={containerW}
                renderAnnotationLayer={true}
                renderTextLayer={false}
                className="resume-pdf-page"
              />
            ))}
        </Document>
      </div>

      {/* Actions */}
      <div className="resume-actions">
        <a
          href="/Kanav-Resume.pdf"
          download="Kanav-Trivedi-Resume.pdf"
          className="btn btn-red"
          data-magnetic
        >
          Download PDF ↓
        </a>
        <a
          href="/Kanav-Resume.pdf"
          target="_blank"
          rel="noreferrer"
          className="btn"
          data-magnetic
        >
          Open full screen ↗
        </a>
      </div>
    </section>
  );
}
