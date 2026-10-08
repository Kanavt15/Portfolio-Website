// Brand artwork is downloaded from Devicon; concepts use Lucide symbols.
// Exact sources and upstream licenses are retained in public/skill-icons/.
export const skillIcons = {
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

export const skillIconPath = (skill) =>
  skillIcons[skill] ? `/skill-icons/${skillIcons[skill]}.svg` : undefined;

// Dark single-color marks and concept symbols need light ink on the monitors.
// Multicolor logos keep their recognizable colors with a softer saturation.
const lightInkSkills = new Set([
  "Express.js",
  "Flask",
  "Three.js",
  "Electron",
  "MySQL",
  "GitHub",
  "AWS Cloud",
  "SQL",
  "REST APIs",
  "Authentication",
  "Database design",
  "CNNs",
  "Data preprocessing",
  "DSA",
  "OOP",
  "DBMS",
  "Operating Systems",
  "Computer Networks",
]);
export const skillIconTreatment = (skill) =>
  lightInkSkills.has(skill) ? "brass" : "color";
