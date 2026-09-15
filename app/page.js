import Hero       from '@/components/Hero';
import Marquee    from '@/components/Marquee';
import About      from '@/components/About';
import Experience from '@/components/Experience';
import Projects   from '@/components/Projects';
import Skills     from '@/components/Skills';
import Awards     from '@/components/Awards';
import Contact    from '@/components/Contact';

export default function HomePage() {
  return (
    <>
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
      <Contact />
    </>
  );
}
