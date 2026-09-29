import Hero         from '@/components/Hero';
import Marquee      from '@/components/Marquee';
import About        from '@/components/About';
import Experience   from '@/components/Experience';
import Projects     from '@/components/Projects';
import Skills       from '@/components/Skills';
import Awards       from '@/components/Awards';
import ResumeClient from '@/components/ResumeClient';
import Contact      from '@/components/Contact';
import PageWrapper  from '@/components/PageWrapper';

export default function HomePage() {
  return (
    <PageWrapper>
      <Hero />
      <Marquee />
      <About />
      <div className="line-divider" />
      <Experience />
      <div className="line-divider" />
      <Projects />
      <div className="line-divider" />
      <Skills />
      <div className="line-divider" />
      <Awards />
      <div className="line-divider" />
      <ResumeClient />
      <Contact />
    </PageWrapper>
  );
}
