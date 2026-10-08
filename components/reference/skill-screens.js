import * as THREE from "three";
import {
  skillIcons,
  skillIconPath,
  skillIconTreatment,
} from "../house/skill-icons.js";

// These images are bundled local copies of the downloaded artwork. A missing
// logo falls back to its label without blocking the house or leaving a blank tile.
export async function loadSkillLogos(signal) {
  const entries = await Promise.all(
    Object.keys(skillIcons).map(
      (skill) =>
        new Promise((resolve) => {
          if (signal?.aborted) {
            resolve([skill, null]);
            return;
          }
          const image = new Image();
          let timer;
          let settled = false;
          const finish = (value) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            signal?.removeEventListener("abort", abort);
            image.onload = null;
            image.onerror = null;
            resolve([skill, value]);
          };
          const abort = () => {
            finish(null);
            image.src = "";
          };
          image.onload = () => finish(image);
          image.onerror = () => finish(null);
          signal?.addEventListener("abort", abort, { once: true });
          timer = setTimeout(() => finish(null), 6000);
          image.src = skillIconPath(skill);
        }),
    ),
  );
  return Object.fromEntries(entries);
}

export function createSkillDisplayTexture(group, logos = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");
  const glass = ctx.createLinearGradient(0, 0, 1024, 640);
  glass.addColorStop(0, "#24312b");
  glass.addColorStop(0.45, "#111f20");
  glass.addColorStop(1, "#091416");
  ctx.fillStyle = glass;
  ctx.fillRect(0, 0, 1024, 640);
  ctx.strokeStyle = "#9d8c6266";
  ctx.lineWidth = 1;
  ctx.strokeRect(24.5, 24.5, 975, 591);
  // Short brass corner details echo the monitor frames in the supplied model.
  ctx.strokeStyle = "#c5ad78";
  ctx.lineWidth = 3;
  for (const [x, y, dx, dy] of [
    [24, 24, 1, 1],
    [1000, 24, -1, 1],
    [24, 616, 1, -1],
    [1000, 616, -1, -1],
  ]) {
    ctx.beginPath();
    ctx.moveTo(x, y + dy * 24);
    ctx.lineTo(x, y);
    ctx.lineTo(x + dx * 30, y);
    ctx.stroke();
  }
  ctx.fillStyle = "#b7a77f";
  ctx.font = "500 18px sans-serif";
  ctx.fillText("KANAV TRIVEDI  /  THE LABORATORY", 62, 65);
  ctx.fillStyle = "#e7e2d0";
  ctx.font = "500 46px sans-serif";
  ctx.fillText(group.name, 60, 125, 900);

  const columns = group.items.length <= 4 ? 2 : 3;
  const rows = Math.ceil(group.items.length / columns);
  const gap = 20;
  const width = (900 - gap * (columns - 1)) / columns;
  const height = (404 - gap * (rows - 1)) / rows;
  group.items.forEach((skill, index) => {
    const x = 62 + (index % columns) * (width + gap);
    const y = 160 + Math.floor(index / columns) * (height + gap);
    const panel = ctx.createLinearGradient(x, y, x + width, y + height);
    panel.addColorStop(0, "#354139");
    panel.addColorStop(0.4, "#203130");
    panel.addColorStop(1, "#142325");
    ctx.fillStyle = panel;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 7);
    ctx.fill();
    ctx.strokeStyle = "#a18c594d";
    ctx.lineWidth = 1;
    ctx.stroke();
    const logo = logos[skill];
    const centerX = x + width / 2;
    const logoSize = Math.min(105, height - 68);
    const logoY = y + 23;
    const halo = ctx.createRadialGradient(
      centerX,
      logoY + logoSize / 2,
      4,
      centerX,
      logoY + logoSize / 2,
      90,
    );
    halo.addColorStop(0, "#d5b97724");
    halo.addColorStop(1, "#d5b97700");
    ctx.fillStyle = halo;
    ctx.fillRect(x + 1, y + 1, width - 2, height - 2);
    if (logo) {
      const ratio = Math.min(
        logoSize / logo.naturalWidth,
        logoSize / logo.naturalHeight,
      );
      const drawWidth = logo.naturalWidth * ratio;
      const drawHeight = logo.naturalHeight * ratio;
      ctx.save();
      ctx.filter =
        skillIconTreatment(skill) === "brass"
          ? "brightness(0) invert(86%) sepia(24%) saturate(560%) hue-rotate(352deg)"
          : "saturate(0.72) brightness(1.18)";
      ctx.shadowColor = "#d6bc8240";
      ctx.shadowBlur = 9;
      ctx.drawImage(
        logo,
        centerX - drawWidth / 2,
        logoY + (logoSize - drawHeight) / 2,
        drawWidth,
        drawHeight,
      );
      ctx.restore();
    } else {
      ctx.fillStyle = "#d6bc82";
      ctx.textAlign = "center";
      ctx.font = "600 48px sans-serif";
      ctx.fillText(skill.slice(0, 2).toUpperCase(), centerX, logoY + 70);
    }
    ctx.textAlign = "center";
    ctx.fillStyle = "#e2dcc6";
    ctx.font = "500 28px sans-serif";
    ctx.fillText(skill, centerX, y + height - 20, width - 18);
    ctx.textAlign = "left";
    ctx.fillStyle = "#c8b17b";
    ctx.fillRect(x + 14, y + 14, 18, 2);
  });
  // A very light glass reflection and scan texture sit behind the physical
  // monitor frame, without a bright tile background competing with the house.
  const reflection = ctx.createLinearGradient(0, 0, 700, 640);
  reflection.addColorStop(0, "#f2ddab0a");
  reflection.addColorStop(0.45, "#f2ddab00");
  reflection.addColorStop(1, "#f2ddab00");
  ctx.fillStyle = reflection;
  ctx.fillRect(25, 25, 974, 590);
  ctx.fillStyle = "#d5c49a05";
  for (let y = 28; y < 615; y += 4) ctx.fillRect(26, y, 972, 1);
  ctx.fillStyle = "#a69d7e";
  ctx.font = "17px sans-serif";
  ctx.fillText("TOOLS, TECHNOLOGIES & FOUNDATIONS", 62, 597);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;
  texture.anisotropy = 4;
  return texture;
}
