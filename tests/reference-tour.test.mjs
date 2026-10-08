import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as THREE from "three";
import {
  createCameraSampler,
  sampleTrack,
  tourTime,
  tourTimes,
} from "../components/reference/camera-sampler.js";
import { personalizeModel } from "../components/reference/personalize-model.js";
import {
  projects,
  rooms,
  skillGroups,
} from "../components/house/portfolio-data.js";

const state = JSON.parse(
  readFileSync(
    new URL("../components/reference/camera-path.json", import.meta.url),
  ),
);

test("the camera reaches the authored room poses and remains finite throughout the scroll", () => {
  const sample = createCameraSampler(state);
  const data = state.sheetsById.Scene.sequence.tracksByObject.Camera;
  for (const [path, track] of Object.entries(data.trackIdByPropPath)) {
    const prop = JSON.parse(path);
    for (const key of data.trackData[track].keyframes) {
      const pose = sample(key.position);
      const value = prop.length === 2 ? pose[prop[0]][prop[1]] : pose[prop[0]];
      assert.ok(
        Math.abs(value - key.value) < 0.00001,
        `${path} at ${key.position}`,
      );
    }
  }
  assert.equal(rooms.length, tourTimes.length);
  assert.equal(tourTime(-1), tourTimes[0]);
  assert.equal(tourTime(100), tourTimes.at(-1));
  for (let p = 0; p <= 6; p += 0.005) {
    const camera = sample(tourTime(p));
    assert.ok(Object.values(camera.position).every(Number.isFinite));
    assert.ok(Object.values(camera.rotation).every(Number.isFinite));
    assert.ok(camera.far > camera.near);
  }
});

test("Bezier easing follows authored handles and discrete keys hold their value", () => {
  const keys = [
    { position: 0, value: 0, connectedRight: true, handles: [0, 0, 0.42, 0] },
    { position: 1, value: 1, handles: [1, 1, 1, 1] },
  ];
  assert.ok(Math.abs(sampleTrack(keys, 0.5) - 0.31536) < 0.001);
  keys[0].connectedRight = false;
  assert.equal(sampleTrack(keys, 0.8), 0);
  assert.equal(sampleTrack(keys, 1), 1);
});

test("reference screen graphics are replaced and the fourth pod can display every remaining project", () => {
  const previousDocument = globalThis.document;
  const context = new Proxy(
    {},
    {
      get: (target, key) => {
        if (key === "createLinearGradient" || key === "createRadialGradient")
          return () => ({ addColorStop() {} });
        return target[key] ?? (() => {});
      },
      set: (target, key, value) => {
        target[key] = value;
        return true;
      },
    },
  );
  globalThis.document = {
    createElement: () => ({ getContext: () => context }),
  };
  try {
    const model = new THREE.Group();
    const originalTexture = new THREE.Texture();
    const originalMaterial = new THREE.MeshStandardMaterial({
      map: originalTexture,
    });
    originalMaterial.name = "KB3D_CPI_ScreensGraphics";
    const originalGeometry = new THREE.PlaneGeometry(1, 1);
    for (let i = 1; i <= 4; i++) {
      const mesh = new THREE.Mesh(originalGeometry, originalMaterial);
      mesh.name = `Project_${i}`;
      model.add(mesh);
    }
    const terminal = new THREE.Mesh(originalGeometry, originalMaterial);
    model.add(terminal);
    const monitor = new THREE.Group();
    monitor.name = "Monitor_1";
    const screen = new THREE.Mesh(originalGeometry, originalMaterial);
    const casingMaterial = new THREE.MeshStandardMaterial({ color: "#555555" });
    const casing = new THREE.Mesh(originalGeometry, casingMaterial);
    monitor.add(screen, casing);
    model.add(monitor);
    const released = new Set();
    [originalTexture, originalMaterial, originalGeometry].forEach((resource) =>
      resource.addEventListener("dispose", () => released.add(resource)),
    );
    const result = personalizeModel(model, projects, skillGroups);
    assert.equal(result.targets.length, 4);
    assert.notEqual(terminal.material.map, originalTexture);
    assert.ok(screen.material.map.isCanvasTexture);
    assert.notEqual(screen.material.map, terminal.material.map);
    assert.equal(casing.material, casingMaterial);
    assert.equal(casing.geometry, originalGeometry);
    for (let i = 3; i < projects.length; i++) {
      result.selectProject(i);
      assert.equal(result.targets[3].userData.projectIndex, i);
      assert.ok(result.targets[3].material.map.isCanvasTexture);
    }
    model.traverse((object) => {
      if (object.isMesh) assert.notEqual(object.material.map, originalTexture);
    });
    result.dispose();
    assert.equal(released.size, 3);
  } finally {
    globalThis.document = previousDocument;
  }
});

test("only the five requested projects are included and the supplied local GLB is valid", () => {
  assert.deepEqual(projects.map((project) => project.name).sort(), [
    "CAD-C",
    "ReFace",
    "SSTC",
    "SkillVerse",
    "Vanaspati",
  ]);
  assert.equal(new Set(projects.map((project) => project.source)).size, 5);
  projects.forEach((project) =>
    assert.equal(new URL(project.source).protocol, "https:"),
  );
  assert.equal(
    projects.find((project) => project.name === "ReFace").live,
    "https://reface-website.onrender.com",
  );
  const model = readFileSync(
    new URL("../public/models/portfolio-house.glb", import.meta.url),
  );
  assert.equal(model.toString("ascii", 0, 4), "glTF");
  assert.equal(model.readUInt32LE(4), 2);
  assert.equal(model.readUInt32LE(8), model.length);
});
