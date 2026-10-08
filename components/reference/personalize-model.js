import * as THREE from "three";
import { createSkillDisplayTexture } from "./skill-screens.js";
export { loadSkillLogos } from "./skill-screens.js";

export function createDisplayTexture(title, subtitle, accent = "#bca475") {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#0b181a";
  ctx.fillRect(0, 0, 1024, 640);
  ctx.strokeStyle = "#6d918b25";
  ctx.lineWidth = 1;
  for (let i = 0; i < 1024; i += 64) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 640);
    ctx.stroke();
  }
  for (let i = 0; i < 640; i += 64) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(1024, i);
    ctx.stroke();
  }
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.strokeRect(35, 35, 954, 570);
  ctx.fillStyle = accent;
  ctx.font = "500 24px sans-serif";
  ctx.fillText("KANAV TRIVEDI", 75, 97);
  ctx.font = `500 ${title.length > 16 ? 46 : 70}px sans-serif`;
  ctx.fillStyle = "#eef1e6";
  ctx.fillText(title, 75, 298, 870);
  ctx.fillStyle = "#a5bcb5";
  ctx.font = "26px sans-serif";
  const lines = Array.isArray(subtitle) ? subtitle : [subtitle];
  lines.forEach((line, index) => ctx.fillText(line, 75, 365 + index * 42, 860));
  ctx.fillStyle = accent;
  ctx.fillRect(75, 460, 98, 5);
  ctx.font = "22px sans-serif";
  ctx.fillText("Explore the portfolio", 75, 536);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;
  texture.anisotropy = 4;
  return texture;
}

function normalizeScreenUV(object, geometries, flipX = false) {
  const geometry = object.geometry.clone();
  geometries.push(geometry);
  object.geometry = geometry;
  const uv = geometry.getAttribute("uv");
  if (!uv) return;
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (let i = 0; i < uv.count; i++) {
    minX = Math.min(minX, uv.getX(i));
    maxX = Math.max(maxX, uv.getX(i));
    minY = Math.min(minY, uv.getY(i));
    maxY = Math.max(maxY, uv.getY(i));
  }
  for (let i = 0; i < uv.count; i++) {
    const x = (uv.getX(i) - minX) / (maxX - minX || 1);
    uv.setXY(i, flipX ? 1 - x : x, (uv.getY(i) - minY) / (maxY - minY || 1));
  }
  uv.needsUpdate = true;
}

export function personalizeModel(
  model,
  projects,
  skillGroups = [],
  skillLogos = {},
) {
  const textures = [],
    materials = [],
    geometries = [],
    targets = [];
  const originalResources = new Set();
  model.traverse((object) => {
    if (!object.isMesh) return;
    originalResources.add(object.geometry);
    for (const material of Array.isArray(object.material)
      ? object.material
      : [object.material]) {
      originalResources.add(material);
      Object.values(material)
        .filter((value) => value?.isTexture)
        .forEach((texture) => originalResources.add(texture));
    }
  });
  // Replace the embedded screen atlas, which contains the reference's projects
  // and technology logos. No reference biography or screens reach the UI.
  const identityTexture = createDisplayTexture(
    "Build. Learn. Repeat.",
    "Backend systems / Machine learning",
  );
  textures.push(identityTexture);
  const projectTextures = projects.map((project) => {
    const texture = createDisplayTexture(
      project.name,
      project.tags.slice(0, 3).join("  /  "),
    );
    textures.push(texture);
    return texture;
  });
  const generalScreen = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    map: identityTexture,
    emissive: "#ffffff",
    emissiveMap: identityTexture,
    emissiveIntensity: 0.55,
    roughness: 0.45,
    metalness: 0.1,
  });
  materials.push(generalScreen);
  const skillMaterials = skillGroups.map((group) => {
    const texture = createSkillDisplayTexture(group, skillLogos);
    textures.push(texture);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    materials.push(material);
    return material;
  });
  const displays = [];
  model.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = true;
    object.receiveShadow = true;
    const original = Array.isArray(object.material)
      ? object.material
      : [object.material];
    const updated = original.map((material) =>
      /ScreensGraphics/.test(material.name) ? generalScreen : material,
    );
    object.material = Array.isArray(object.material) ? updated : updated[0];
    let ancestor = object,
      projectIndex = -1,
      monitorIndex = -1;
    while (ancestor && ancestor !== model) {
      const match = /^Project_(\d+)/.exec(ancestor.name);
      if (match) {
        projectIndex = Number(match[1]) - 1;
        break;
      }
      const monitor = /^Monitor_(\d+)/.exec(ancestor.name);
      if (monitor) monitorIndex = Number(monitor[1]) - 1;
      ancestor = ancestor.parent;
    }
    if (projectIndex >= 0 && projectIndex < projects.length) {
      // The supplied screens sample an atlas. Remap their UV bounds to use
      // one full project display instead of keeping the original atlas crop.
      normalizeScreenUV(object, geometries, projectIndex === 3);
      const material = new THREE.MeshBasicMaterial({
        map: projectTextures[projectIndex],
        side: THREE.DoubleSide,
      });
      materials.push(material);
      object.material = material;
      object.userData.projectIndex = projectIndex;
      targets.push(object);
      displays.push({ object, material, index: projectIndex });
    } else if (
      monitorIndex >= 0 &&
      skillMaterials.length &&
      original.length === 1 &&
      /ScreensGraphics/.test(original[0].name)
    ) {
      // GLTF screen primitives are separate from the monitor casing. Replace
      // only the screen, keeping the model's metal and plastic finishes intact.
      normalizeScreenUV(object, geometries);
      object.material = skillMaterials[monitorIndex % skillMaterials.length];
    }
  });
  // The source has four physical pods. The fourth is a changing showcase for
  // the remaining projects; every project is also reachable by keyboard tabs.
  function selectProject(index) {
    const display = displays.find((item) => item.index === 3);
    if (display && index >= 3) {
      display.material.map = projectTextures[index];
      display.object.userData.projectIndex = index;
    }
  }
  return {
    targets,
    selectProject,
    dispose() {
      const all = new Set([
        ...originalResources,
        ...textures,
        ...materials,
        ...geometries,
      ]);
      all.forEach((resource) => resource.dispose());
    },
  };
}
