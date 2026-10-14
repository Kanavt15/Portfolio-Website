// All portfolio content lives here, extracted from the previous 3D build.

export const profile = {
  name: "Kanav Trivedi",
  first: "Kanav",
  last: "Trivedi",
  role: "Developer & ML Engineer",
  location: "Mumbai, India",
  email: "kanavt.15@gmail.com",
  phone: "+918976036164",
  resume: "/Kanav-Resume.pdf",
  github: "https://github.com/Kanavt15",
  linkedin: "https://www.linkedin.com/in/kanav-trivedi/",
  roles: [
    "backend systems",
    "machine learning",
    "computer vision",
    "interactive 3D",
    "REST APIs",
  ],
};

export const stats = [
  { value: 9.07, decimals: 2, suffix: "/10", label: "CGPA · Semester VI" },
  { value: 2027, decimals: 0, suffix: "", label: "Graduating class", plain: true },
  { value: 2, decimals: 0, suffix: "", label: "Industry internships" },
  { value: 5, decimals: 0, suffix: "", label: "Featured projects" },
];

export const experience = [
  {
    company: "Claidroid Technologies",
    role: "Machine Learning Intern",
    date: "Dec 2024 — Jul 2025",
    summary:
      "Built and optimized convolutional neural networks with Python and TensorFlow, achieving 85% accuracy on CIFAR-100.",
    detail:
      "Improved model validation through data preprocessing, augmentation, hyperparameter tuning, and benchmark comparisons.",
    tags: ["Python", "TensorFlow", "CNNs", "Data augmentation"],
    metric: { value: 85, suffix: "%", label: "CIFAR-100 accuracy" },
  },
  {
    company: "Central Railway",
    role: "Technical Intern",
    date: "Jul — Aug 2024",
    summary:
      "Studied Mumbai’s EMU operations and maintenance, gaining practical exposure to hardware infrastructure and railway systems.",
    detail:
      "Learned safety protocols and how large engineering systems are maintained through coordinated technical operations.",
    tags: ["Systems", "Infrastructure", "Safety protocols"],
    metric: { value: 2, suffix: " mo", label: "On-site training" },
  },
];

export const projects = [
  {
    name: "ReFace",
    type: "3D reconstruction · Forensic tools",
    year: "2026",
    description:
      "A forensic facial reconstruction desktop app. Shape a 3D face with detailed morph controls, revisit edits with undo and redo, and save or share complete reconstruction cases.",
    tags: ["Electron", "Three.js", "Python", "Flask", "Blender"],
    source: "https://github.com/Kanavt15/reface-id",
    live: "https://reface-website.onrender.com",
    image: "/projects/reface.png",
    accent: "#8b7cff",
  },
  {
    name: "Vanaspati",
    type: "Interactive 3D · Botanical exploration",
    year: "SIH",
    description:
      "An explorable garden of 25 medicinal plants, six themed beds, and guided botanical tours. Every plant is generated from botanical data. Built for Smart India Hackathon.",
    tags: ["React", "Three.js", "TypeScript", "Zustand"],
    source: "https://github.com/Tushar-Surti/virtual-herbal-garden",
    live: "https://tushar-surti.github.io/virtual-herbal-garden/",
    image: "/projects/vanaspati.jpg",
    accent: "#34d399",
  },
  {
    name: "SkillVerse",
    type: "Full-stack · Learning platform",
    year: "2025",
    description:
      "A learning platform that makes progress tangible. Teachers manage courses, learners take quizzes and earn points, and role-based access keeps each experience focused.",
    tags: ["React", "Node.js", "Express", "MySQL"],
    source: "https://github.com/Kanavt15/SkillVerse",
    image: "/projects/skillverse.jpg",
    accent: "#a78bfa",
  },
  {
    name: "CAD-C",
    type: "Machine learning · Computer vision",
    year: "2025",
    description:
      "An experimental lung-nodule classification system for CT scans. Compares 3D convolutional networks through a Flask interface, with a hosted research demo on Hugging Face.",
    tags: ["Python", "PyTorch", "3D CNN", "Flask"],
    source: "https://github.com/Kanavt15/CAD-C",
    live: "https://huggingface.co/spaces/kanavt/CAD-C",
    liveLabel: "Hugging Face demo",
    image: "/projects/cadc.jpg",
    accent: "#22d3ee",
  },
  {
    name: "SSTC",
    type: "Full-stack · Campus community",
    year: "2025",
    description:
      "A campus collaboration platform. Department chat, shared notes, study resources, and an AI study assistant bring students together in one place.",
    tags: ["React", "Node.js", "MySQL", "Socket.IO"],
    source: "https://github.com/Kanavt15/SSTC",
    image: "/projects/sstc.png",
    accent: "#f472b6",
  },
];

export const skillGroups = [
  { name: "Languages", items: ["C", "C++", "JavaScript", "Python", "SQL"] },
  {
    name: "Backend",
    items: ["Node.js", "Express.js", "Flask", "REST APIs", "Authentication"],
  },
  {
    name: "Frontend & 3D",
    items: ["React", "Next.js", "Three.js", "TypeScript", "Electron", "Blender"],
  },
  {
    name: "Databases",
    items: ["MySQL", "MongoDB", "PostgreSQL", "Database design"],
  },
  {
    name: "Machine learning",
    items: ["TensorFlow", "PyTorch", "Scikit-learn", "OpenCV", "CNNs", "Data preprocessing"],
  },
  {
    name: "Core CS",
    items: ["DSA", "OOP", "DBMS", "Operating Systems", "Computer Networks"],
  },
  {
    name: "Tools & cloud",
    items: ["Git", "GitHub", "VS Code", "AWS Cloud", "Docker", "Linux"],
  },
];

export const awards = [
  {
    title: "3rd Prize, Tantragyan",
    detail: "National-level project competition",
    org: "K. J. Somaiya",
    year: "2026",
    kind: "Competition",
    url: "https://drive.google.com/file/d/1S4RQ6Z-Ol5Y2W3bbxxkXdr03ep6w0mGG/view",
  },
  {
    title: "2nd Prize, TECHSPARK-CSI-IT",
    detail: "Technical project competition",
    org: "FCRIT",
    year: "2nd",
    kind: "Competition",
    url: "https://drive.google.com/file/d/1XT6qzjJOQbJ3V1K_S5JwvREl_QAak5ZV/view",
  },
  {
    title: "AWS Academy Graduate",
    detail: "Cloud Foundations · Training badge",
    org: "Amazon Web Services",
    year: "2026",
    kind: "Certification",
    url: "https://drive.google.com/file/d/1j35Lc63Fx_GA3q57W0WmB5GOJyFAG_0v/view",
  },
  {
    title: "GenW.AI Explorer, Level 1",
    detail: "Deloitte Hacksplosion",
    org: "Deloitte",
    year: "2026",
    kind: "Hackathon",
    url: "https://drive.google.com/file/d/1HEpwlpOyAt1UCPms9MxyRvoWI_YWWwh4/view",
  },
];

export const nav = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "awards", label: "Awards" },
  { id: "contact", label: "Contact" },
];

// Brand artwork from Devicon; concepts use Lucide symbols (see public/skill-icons/).
const skillIcons = {
  C: "c",
  "C++": "cplusplus",
  JavaScript: "javascript",
  Python: "python",
  SQL: "database",
  "Node.js": "nodejs",
  "Express.js": "express",
  Flask: "flask",
  "REST APIs": "webhook",
  Authentication: "shield-check",
  React: "react",
  "Next.js": "nextjs",
  "Three.js": "threejs",
  TypeScript: "typescript",
  Electron: "electron",
  Blender: "blender",
  MySQL: "mysql",
  MongoDB: "mongodb",
  PostgreSQL: "postgresql",
  "Database design": "database-zap",
  TensorFlow: "tensorflow",
  PyTorch: "pytorch",
  "Scikit-learn": "scikitlearn",
  OpenCV: "opencv",
  CNNs: "brain-circuit",
  "Data preprocessing": "list-filter",
  DSA: "workflow",
  OOP: "boxes",
  DBMS: "database-backup",
  "Operating Systems": "monitor-cog",
  "Computer Networks": "network",
  Git: "git",
  GitHub: "github",
  "VS Code": "vscode",
  "AWS Cloud": "amazonwebservices",
  Docker: "docker",
  Linux: "linux",
};

export const skillIcon = (skill) =>
  skillIcons[skill] ? `/skill-icons/${skillIcons[skill]}.svg` : null;

// Dark single-colour marks need inverting to read on a dark background.
const invertSkills = new Set(["Express.js", "Flask", "Three.js", "Next.js", "GitHub", "AWS Cloud", "MySQL"]);
export const skillInvert = (skill) => invertSkills.has(skill);
