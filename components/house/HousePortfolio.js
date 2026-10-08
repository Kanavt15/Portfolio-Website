"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import HouseScene from "../reference/ReferenceHouseScene";
import ProjectArtwork from "./ProjectArtwork";
import { awards, projects, rooms, skillGroups } from "./portfolio-data";

function HouseIcon({ size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m3 13 11-9 11 9M6 11v13h16V11M11 24v-8h6v8M19 5V2h3v6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function Arrow({ diagonal = false }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? "M6 18 18 6M6 6h12v12" : "M5 12h14m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function RoomLabel({ id }) {
  const index = rooms.findIndex((room) => room.id === id);
  const room = rooms[index];
  return (
    <div className="room-label">
      <span className="room-number">{String(index).padStart(2, "0")}</span>
      <span>{room.name}</span>
      <span className="room-floor">{room.floor}</span>
    </div>
  );
}
const subscribeMotion = (callback) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
const getMotion = () =>
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function HousePortfolio() {
  const travel = useRef(0);
  const page = useRef(null);
  const menu = useRef(null);
  const menuButton = useRef(null);
  const [active, setActive] = useState(0);
  const [directory, setDirectory] = useState(false);
  const [selected, setSelected] = useState(0);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaderDismissed, setLoaderDismissed] = useState(false);
  const [sceneError, setSceneError] = useState(false);
  const [manualMotion, setManualMotion] = useState(null);
  const systemMotion = useSyncExternalStore(
    subscribeMotion,
    getMotion,
    () => true,
  );
  const motion = manualMotion ?? systemMotion;
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => {
    setSceneError(true);
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = motion ? "full" : "reduced";
    return () => {
      delete document.documentElement.dataset.motion;
    };
  }, [motion]);

  useEffect(() => {
    const sections = rooms.map((room) => document.getElementById(room.id));
    let frame;
    function update() {
      const y = window.scrollY;
      const lead = window.innerWidth < 761 ? 0.5 : 0.17;
      const offsets = sections.map((section, i) =>
        Math.max(0, section.offsetTop - (i ? window.innerHeight * lead : 0)),
      );
      let index = 0;
      for (let i = 1; i < offsets.length; i++) if (y >= offsets[i]) index = i;
      const next = Math.min(index + 1, offsets.length - 1);
      const raw =
        next === index
          ? 0
          : (y - offsets[index]) / (offsets[next] - offsets[index]);
      // Spread the journey over more scroll distance instead of rushing the
      // camera through a short transition at the end of each room.
      const hold = rooms[index].id === "projects" ? 0.7 : 0.3;
      const fraction = Math.min(1, Math.max(0, (raw - hold) / (1 - hold)));
      travel.current = index + fraction;
      const visible = sections.findLastIndex(
        (section) =>
          section.getBoundingClientRect().top <= window.innerHeight * 0.46,
      );
      setActive(Math.max(0, visible));
      page.current?.style.setProperty(
        "--journey-progress",
        `${(y / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)) * 100}%`,
      );
    }
    function scroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    const resize = new ResizeObserver(scroll);
    sections.forEach((section) => resize.observe(section));
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
    };
  }, []);

  useEffect(() => {
    if (!directory) return;
    function outside(event) {
      if (
        !menu.current?.contains(event.target) &&
        !menuButton.current?.contains(event.target)
      )
        setDirectory(false);
    }
    function key(event) {
      if (event.key === "Escape") {
        setDirectory(false);
        menuButton.current?.focus();
      }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", key);
    };
  }, [directory]);

  const project = projects[selected];
  return (
    <div
      ref={page}
      className={`house-portfolio${ready || loaderDismissed ? " is-ready" : ""}${sceneError ? " scene-unavailable" : ""}${motion ? "" : " still-mode"}`}
    >
      <a className="skip-link" href="#about">
        Skip to portfolio content
      </a>
      <div className="landscape-wash" aria-hidden="true" />
      <div className="scene-stage">
        <HouseScene
          travel={travel}
          motion={motion}
          projectIndex={selected}
          onReady={onReady}
          onError={onError}
          onProgress={setProgress}
          onProjectSelect={setSelected}
        />
        {sceneError && (
          <div className="scene-fallback">
            <HouseIcon size={100} />
            <p>Make yourself at home.</p>
            <span>All the rooms are here to explore below.</span>
          </div>
        )}
        <div className="scene-caption" aria-hidden="true">
          <span className="caption-line" />
          <span>
            {active === 0
              ? "A home for the things I build"
              : rooms[active].name}
          </span>
          <span className="caption-line" />
        </div>
      </div>
      <div
        className="arrival"
        aria-hidden={ready || loaderDismissed}
        inert={ready || loaderDismissed}
      >
        <div className="arrival-house" aria-hidden="true" />
        <div className="arrival-top">
          <HouseIcon size={28} />
          <span>Kanav Trivedi</span>
        </div>
        <div className="arrival-content">
          <span className="arrival-kicker">
            A house of ideas · Kanav Trivedi
          </span>
          <p>
            Every room,
            <br />a different story.
          </p>
          <div className="arrival-track">
            <span style={{ width: `${progress}%` }} />
          </div>
          <span className="arrival-status" role="status">
            {ready
              ? "The door is open"
              : progress >= 88
                ? "Lighting the rooms…"
                : `Opening the house · ${progress}%`}
          </span>
          <button
            className="loading-skip"
            onClick={() => setLoaderDismissed(true)}
          >
            Explore while it loads <Arrow />
          </button>
        </div>
      </div>
      <header className="site-header">
        <a
          href="#home"
          className="identity"
          aria-label="Kanav Trivedi, back to the entrance"
        >
          <span className="identity-mark">
            <HouseIcon />
          </span>
          <span>
            <strong>Kanav Trivedi</strong>
            <span>Developer &amp; ML engineer</span>
          </span>
        </a>
        <nav className="header-nav" aria-label="Main navigation">
          <button
            ref={menuButton}
            className={`directory-button${directory ? " open" : ""}`}
            onClick={() => setDirectory(!directory)}
            aria-expanded={directory}
            aria-controls="house-directory"
            aria-label="Explore the house"
          >
            <span className="directory-grid">
              <i />
              <i />
              <i />
              <i />
            </span>
            <span>Explore the house</span>
          </button>
          <a
            className="resume-link"
            href="/Kanav-Resume.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Résumé <Arrow diagonal />
          </a>
          <a className="contact-button" href="#contact">
            Let’s talk <Arrow diagonal />
          </a>
        </nav>
        {directory && (
          <nav
            id="house-directory"
            ref={menu}
            className="house-directory"
            aria-label="House directory"
          >
            <div className="directory-heading">
              <HouseIcon size={20} />
              <span>Make yourself at home</span>
              <button
                onClick={() => setDirectory(false)}
                aria-label="Close house directory"
              >
                ×
              </button>
            </div>
            <p>Choose a room, or take the scenic route.</p>
            <div className="floor-plan">
              <span className="plan-floor">The house directory</span>
              {rooms.slice(1).map((room) => (
                <a
                  className={`plan-room${rooms[active].id === room.id ? " current" : ""}`}
                  key={room.id}
                  href={`#${room.id}`}
                  onClick={() => setDirectory(false)}
                >
                  <span>{room.name}</span>
                  <strong>{room.label}</strong>
                  <Arrow diagonal />
                </a>
              ))}
            </div>
            <a
              href="#home"
              className="directory-garden"
              onClick={() => setDirectory(false)}
            >
              Back to the entrance <Arrow />
            </a>
          </nav>
        )}
      </header>
      <main className="tour-content">
        <section
          className="tour-room welcome-room"
          id="home"
          aria-labelledby="welcome-title"
        >
          <div className="room-content hero-content">
            <div className="welcome-note">
              <span />
              Welcome to my corner of the internet
            </div>
            <h1 id="welcome-title">
              Code, craft
              <br />
              &amp; curiosity.
            </h1>
            <p className="hero-description">
              I’m Kanav Trivedi, a developer &amp; ML engineer in Mumbai. Come
              inside and explore the systems, experiments, and ideas I build.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#about">
                Step inside <Arrow />
              </a>
              <a className="text-link" href="#projects">
                View my work <Arrow diagonal />
              </a>
            </div>
            <div className="hero-postscript">
              <svg
                width="32"
                height="40"
                viewBox="0 0 32 40"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M16 2v31m-7-8 7 8 7-8"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path
                  d="M7 11V7a9 9 0 0 1 18 0v4"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeDasharray="2 3"
                />
              </svg>
              <span>
                A house. Seven stops.
                <br />
                Scroll and make yourself at home.
              </span>
            </div>
          </div>
          <div className="garden-location">
            <span className="sun-symbol">☀</span>
            <span>
              Built with curiosity
              <br />
              <strong>Based in Mumbai, India</strong>
            </span>
          </div>
        </section>
        <section className="tour-room" id="about" aria-labelledby="about-title">
          <div className="room-content">
            <RoomLabel id="about" />
            <h2 id="about-title">
              Good to have
              <br />
              you here.
            </h2>
            <p className="room-intro">
              I’m Kanav Trivedi. A curious mind, a hands-on builder, and a
              Computer Engineering student with Honors in AI &amp; ML.
            </p>
            <p>
              I study at K. J. Somaiya Institute of Technology in Mumbai,
              graduating in 2027. My work moves between backend systems, REST
              APIs, computer vision, and machine learning pipelines.
            </p>
            <p>
              I like understanding how things work, then making them work a
              little better.
            </p>
            <dl className="about-facts">
              <div>
                <dt>
                  9.07<span>/10</span>
                </dt>
                <dd>CGPA · Semester VI</dd>
              </div>
              <div>
                <dt>2027</dt>
                <dd>Graduating class</dd>
              </div>
              <div>
                <dt>2</dt>
                <dd>Industry internships</dd>
              </div>
            </dl>
            <a
              className="text-link"
              href="/Kanav-Resume.pdf"
              target="_blank"
              rel="noreferrer"
            >
              The story on paper <Arrow diagonal />
            </a>
          </div>
        </section>
        <section
          className="tour-room"
          id="experience"
          aria-labelledby="experience-title"
        >
          <div className="room-content">
            <RoomLabel id="experience" />
            <h2 id="experience-title">
              Learning,
              <br />
              out in the world.
            </h2>
            <p className="room-intro">
              Some of the best lessons happen beyond the classroom.
            </p>
            <div className="experience-list">
              <article>
                <span className="experience-date">Dec 2024 – Jul 2025</span>
                <h3>Claidroid Technologies</h3>
                <span className="experience-role">Machine Learning Intern</span>
                <p>
                  Built and optimized convolutional neural networks with Python
                  and TensorFlow, achieving 85% accuracy on CIFAR-100.
                </p>
                <details>
                  <summary>
                    More about the role <span>+</span>
                  </summary>
                  <p>
                    Improved model validation through data preprocessing,
                    augmentation, hyperparameter tuning, and benchmark
                    comparisons.
                  </p>
                </details>
              </article>
              <article>
                <span className="experience-date">Jul – Aug 2024</span>
                <h3>Central Railway</h3>
                <span className="experience-role">Technical Intern</span>
                <p>
                  Studied Mumbai’s EMU operations and maintenance, gaining
                  practical exposure to hardware infrastructure and railway
                  systems.
                </p>
                <details>
                  <summary>
                    More about the role <span>+</span>
                  </summary>
                  <p>
                    Learned safety protocols and how large engineering systems
                    are maintained through coordinated technical operations.
                  </p>
                </details>
              </article>
            </div>
          </div>
        </section>
        <section
          className="tour-room"
          id="awards"
          aria-labelledby="awards-title"
        >
          <div className="room-content">
            <RoomLabel id="awards" />
            <h2 id="awards-title">
              A few things
              <br />
              on the mantel.
            </h2>
            <p className="room-intro">
              Milestones from competitions, learning, and showing up with
              something to share.
            </p>
            <div className="award-list">
              {awards.map((award) => (
                <a
                  key={award.title}
                  href={award.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="award-year">{award.year}</span>
                  <span>
                    <strong>{award.title}</strong>
                    <small>{award.detail}</small>
                  </span>
                  <Arrow diagonal />
                </a>
              ))}
            </div>
          </div>
        </section>
        <section
          className="tour-room"
          id="skills"
          aria-labelledby="skills-title"
        >
          <div className="room-content">
            <RoomLabel id="skills" />
            <h2 id="skills-title">
              Skills that
              <br />
              bring ideas to life.
            </h2>
            <p className="room-intro">
              From backend services and database design to interactive 3D and
              machine learning. The tools and foundations behind my work.
            </p>
            <div className="skill-shelves">
              {skillGroups.map(({ name, items }) => (
                <div className="skill-shelf" key={name}>
                  <h3>{name}</h3>
                  <ul>
                    {items.map((value) => (
                      <li key={value}>{value}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section
          className="tour-room gallery-room"
          id="projects"
          aria-labelledby="projects-title"
        >
          <div className="room-content gallery-content">
            <RoomLabel id="projects" />
            <div className="gallery-heading">
              <h2 id="projects-title">
                Ideas you
                <br />
                can step into.
              </h2>
              <p>
                The workshop
                <br />
                <span>Five projects, on display.</span>
              </p>
            </div>
            <div
              className="project-selector"
              role="tablist"
              aria-label="Select a project"
            >
              {projects.map((item, i) => (
                <button
                  key={item.name}
                  id={`project-tab-${i}`}
                  role="tab"
                  aria-selected={selected === i}
                  aria-controls="project-panel"
                  tabIndex={selected === i ? 0 : -1}
                  onClick={() => setSelected(i)}
                  onKeyDown={(event) => {
                    let next = i;
                    if (event.key === "ArrowRight")
                      next = (i + 1) % projects.length;
                    else if (event.key === "ArrowLeft")
                      next = (i + projects.length - 1) % projects.length;
                    else if (event.key === "Home") next = 0;
                    else if (event.key === "End") next = projects.length - 1;
                    else return;
                    event.preventDefault();
                    setSelected(next);
                    document.getElementById(`project-tab-${next}`)?.focus();
                  }}
                >
                  {item.tab || item.name}
                </button>
              ))}
            </div>
            <article
              className="featured-project"
              role="tabpanel"
              id="project-panel"
              aria-labelledby={`project-tab-${selected}`}
              tabIndex={0}
            >
              <div className="project-visual">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    sizes="(max-width: 760px) 90vw, 560px"
                    style={{ objectFit: project.imageFit || "contain" }}
                  />
                ) : (
                  <ProjectArtwork kind={project.art} />
                )}
                <span className="project-count">
                  {String(selected + 1).padStart(2, "0")} /{" "}
                  {String(projects.length).padStart(2, "0")}
                </span>
              </div>
              <div className="project-details">
                <span className="project-type">{project.type}</span>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <ul className="technology-list" aria-label="Technologies">
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <div className="project-links">
                  {project.live && (
                    <a
                      className="primary-button"
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {project.liveLabel || "Visit project"} <Arrow diagonal />
                    </a>
                  )}
                  <a
                    className="text-link"
                    href={project.source}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View source <Arrow diagonal />
                  </a>
                </div>
              </div>
            </article>
            <details className="all-projects">
              <summary>
                Browse all {projects.length} projects <span>+</span>
              </summary>
              <ul>
                {projects.map((item) => (
                  <li key={item.name}>
                    <span>
                      <strong>{item.name}</strong>
                      <small>{item.type}</small>
                    </span>
                    <div>
                      {item.live && (
                        <a
                          href={item.live}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${item.name}: ${item.liveLabel || "visit project"}`}
                        >
                          {item.liveLabel || "Demo"} <Arrow diagonal />
                        </a>
                      )}
                      <a
                        href={item.source}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${item.name}: source code`}
                      >
                        Source <Arrow diagonal />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </details>
            <a
              className="github-link"
              href="https://github.com/Kanavt15"
              target="_blank"
              rel="noreferrer"
            >
              More experiments live on GitHub <Arrow diagonal />
            </a>
          </div>
        </section>
        <section
          className="tour-room contact-room"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="room-content">
            <RoomLabel id="contact" />
            <h2 id="contact-title">
              There’s always
              <br />
              room for an idea.
            </h2>
            <p className="room-intro">
              Have a project, an opportunity, or something interesting in mind?
              Pull up a chair.
            </p>
            <a className="email-link" href="mailto:kanavt.15@gmail.com">
              kanavt.15@gmail.com <Arrow diagonal />
            </a>
            <div className="contact-links">
              <a
                href="https://github.com/Kanavt15"
                target="_blank"
                rel="noreferrer"
              >
                GitHub <Arrow diagonal />
              </a>
              <a
                href="https://www.linkedin.com/in/kanav-trivedi/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn <Arrow diagonal />
              </a>
              <a href="tel:+918976036164">
                Call me <Arrow diagonal />
              </a>
            </div>
            <a className="resume-download" href="/Kanav-Resume.pdf" download>
              <span>
                <HouseIcon size={23} />
                <span>
                  A little more about me
                  <small>Take my résumé with you · PDF</small>
                </span>
              </span>
              <svg
                width="20"
                height="24"
                viewBox="0 0 20 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M10 2v14m-5-5 5 5 5-5M3 17v4h14v-4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <div className="farewell">
              <HouseIcon size={20} />
              <p>
                Thanks for stopping by.
                <br />
                <span>Built with curiosity. Made to feel like home.</span>
              </p>
            </div>
          </div>
        </section>
      </main>
      <nav className="room-wayfinding" aria-label="Jump to a portfolio room">
        {rooms.map((room, i) => (
          <a
            href={`#${room.id}`}
            key={room.id}
            className={active === i ? "active" : ""}
            aria-label={`${room.label}: ${room.name}`}
            aria-current={active === i ? "location" : undefined}
          >
            <span className="wayfinding-label">{room.label}</span>
            <span className="wayfinding-dot" />
          </a>
        ))}
      </nav>
      <footer className="journey-bar">
        <a className="current-room" href="#home">
          <HouseIcon size={19} />
          <span>{rooms[active].name}</span>
          <span className="journey-count">
            {String(active + 1).padStart(2, "0")} <span>/ 07</span>
          </span>
        </a>
        <div className="journey-track" aria-hidden="true">
          <span />
        </div>
        <div className="journey-controls">
          <span className="scroll-instruction">
            {active === 6 ? "You’re always welcome back" : "Scroll to wander"}
            <span>{active === 6 ? "↟" : "↓"}</span>
          </span>
          <button
            className="motion-button"
            onClick={() => setManualMotion(!motion)}
            aria-pressed={!motion}
            aria-label={motion ? "Reduce animations" : "Enable animations"}
          >
            <span
              className={
                motion ? "motion-indicator" : "motion-indicator paused"
              }
            >
              <i />
              <i />
              <i />
            </span>
            <span>{motion ? "Motion on" : "Motion reduced"}</span>
          </button>
        </div>
      </footer>
      <noscript>
        <style>
          {
            ".arrival{display:none}.scene-stage{display:none}.tour-content{width:100%}.room-content{max-width:750px;margin:auto}"
          }
        </style>
      </noscript>
    </div>
  );
}
