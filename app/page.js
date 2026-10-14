import AppShell from "@/components/shell/AppShell";
import Hero from "@/components/sections/Hero";
import About, { MarqueeBand } from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Awards from "@/components/sections/Awards";
import Contact, { Footer } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <AppShell>
      <main id="main-content">
        <Hero />
        <MarqueeBand />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Awards />
        <Contact />
      </main>
      <Footer />
    </AppShell>
  );
}
