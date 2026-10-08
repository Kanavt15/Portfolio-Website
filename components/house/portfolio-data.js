export const projects = [
  {
    name: "ReFace",
    type: "3D reconstruction / Forensic tools",
    description:
      "A forensic facial reconstruction desktop app. Shape a 3D face with detailed morph controls, revisit edits with undo and redo, and save or share complete reconstruction cases.",
    tags: ["Electron", "Three.js", "Python", "Flask", "Blender"],
    source: "https://github.com/Kanavt15/reface-id",
    live: "https://reface-website.onrender.com",
    art: "face",
    image: "/projects/reface.png",
    imageAlt: "ReFace editor showing its 3D facial reconstruction controls",
  },
  {
    name: "Vanaspati",
    type: "Interactive 3D / Botanical exploration",
    description:
      "An explorable garden of 25 medicinal plants, six themed beds, and guided botanical tours. Every plant is generated from botanical data. Built for Smart India Hackathon.",
    tags: ["React", "Three.js", "TypeScript", "Zustand"],
    source: "https://github.com/Tushar-Surti/virtual-herbal-garden",
    live: "https://tushar-surti.github.io/virtual-herbal-garden/",
    art: "garden",
  },
  {
    name: "SkillVerse",
    type: "Full-stack / Learning",
    description:
      "A learning platform that makes progress tangible. Teachers manage courses, learners take quizzes and earn points, and role-based access keeps each experience focused.",
    tags: ["React", "Node.js", "Express", "MySQL"],
    source: "https://github.com/Kanavt15/SkillVerse",
    art: "skills",
  },
  {
    name: "CAD-C",
    type: "Machine learning / Computer vision",
    description:
      "An experimental lung-nodule classification system for CT scans. Compares 3D convolutional networks through a Flask interface, with a hosted research demo on Hugging Face.",
    tags: ["Python", "PyTorch", "3D CNN", "Flask"],
    source: "https://github.com/Kanavt15/CAD-C",
    live: "https://huggingface.co/spaces/kanavt/CAD-C",
    art: "cells",
  },
  {
    name: "SSTC",
    tab: "SSTC",
    type: "Full-stack / Campus community",
    description:
      "A campus collaboration platform built as SSTC. Department chat, shared notes, study resources, and an AI study assistant bring students together in one place.",
    tags: ["React", "Node.js", "MySQL", "Socket.IO"],
    source: "https://github.com/Kanavt15/SSTC",
    art: "study",
    image: "/projects/sstc.png",
    imageAlt: "KJSIT Connect student collaboration platform landing page",
  },
];

export const skillGroups = [
  { name: "Languages", items: ["C", "C++", "JavaScript", "Python", "SQL"] },
  {
    name: "Backend & APIs",
    items: ["Node.js", "Express.js", "Flask", "REST APIs", "Authentication"],
  },
  {
    name: "Frontend & 3D",
    items: [
      "React",
      "Next.js",
      "Three.js",
      "TypeScript",
      "Electron",
      "Blender",
    ],
  },
  {
    name: "Databases",
    items: ["MySQL", "MongoDB", "PostgreSQL", "Database design"],
  },
  {
    name: "Machine learning",
    items: [
      "TensorFlow",
      "PyTorch",
      "Scikit-learn",
      "OpenCV",
      "CNNs",
      "Data preprocessing",
    ],
  },
  {
    name: "Core concepts",
    items: ["DSA", "OOP", "DBMS", "Operating Systems", "Computer Networks"],
  },
  {
    name: "Tools & cloud",
    items: ["Git", "GitHub", "VS Code", "AWS Cloud", "Docker", "Linux"],
  },
];

export const rooms = [
  { id: "home", name: "The threshold", label: "Welcome", floor: "Arrival" },
  {
    id: "about",
    name: "The entrance",
    label: "About",
    floor: "The introduction",
  },
  {
    id: "experience",
    name: "The reading room",
    label: "Experience",
    floor: "Learning by doing",
  },
  {
    id: "awards",
    name: "The collection",
    label: "Recognition",
    floor: "Small milestones",
  },
  {
    id: "skills",
    name: "The laboratory",
    label: "Skills",
    floor: "Tools of the trade",
  },
  {
    id: "projects",
    name: "The workshop",
    label: "Projects",
    floor: "Five projects",
  },
  {
    id: "contact",
    name: "The lounge",
    label: "Contact",
    floor: "An open invitation",
  },
];

export const awards = [
  {
    title: "3rd Prize, Tantragyan",
    detail: "National-level project competition · K. J. Somaiya",
    year: "2026",
    url: "https://drive.google.com/file/d/1S4RQ6Z-Ol5Y2W3bbxxkXdr03ep6w0mGG/view",
  },
  {
    title: "2nd Prize, TECHSPARK-CSI-IT",
    detail: "Technical project competition · FCRIT",
    year: "2nd",
    url: "https://drive.google.com/file/d/1XT6qzjJOQbJ3V1K_S5JwvREl_QAak5ZV/view",
  },
  {
    title: "AWS Academy Graduate",
    detail: "Cloud Foundations · Training badge",
    year: "2026",
    url: "https://drive.google.com/file/d/1j35Lc63Fx_GA3q57W0WmB5GOJyFAG_0v/view",
  },
  {
    title: "GenW.AI Explorer, Level 1",
    detail: "Deloitte Hacksplosion",
    year: "2026",
    url: "https://drive.google.com/file/d/1HEpwlpOyAt1UCPms9MxyRvoWI_YWWwh4/view",
  },
];
