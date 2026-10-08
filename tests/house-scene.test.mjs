import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { createHouse } from "../components/house/create-house.js";

test("house geometry is finite, fading is isolated, and unmount releases GPU resources", () => {
  // Canvas drawing is browser-owned; this checks model creation and lifecycle.
  const context = new Proxy(
    {},
    {
      get: (target, key) => target[key] ?? (() => {}),
      set: (target, key, value) => {
        target[key] = value;
        return true;
      },
    },
  );
  const previousDocument = globalThis.document;
  globalThis.document = {
    createElement: () => ({ width: 0, height: 0, getContext: () => context }),
  };
  try {
    const scene = new THREE.Scene();
    const house = createHouse(scene);
    const resources = new Set();
    let meshCount = 0;
    scene.updateMatrixWorld(true);
    scene.traverse((object) => {
      assert.ok(object.matrixWorld.elements.every(Number.isFinite));
      if (!object.isMesh) return;
      meshCount++;
      assert.ok(
        object.geometry.attributes.position.array.every(Number.isFinite),
      );
      resources.add(object.geometry);
      resources.add(object.material);
      if (object.material.map) resources.add(object.material.map);
    });
    assert.ok(meshCount > 0);
    const roofMaterial = house.roof.children.find(
      (object) => object.isMesh,
    ).material;
    house.opacity(house.upperFloor, 0.1);
    assert.equal(roofMaterial.opacity, 1);
    house.opacity(house.upperFloor, 1);
    assert.equal(house.upperFloor.visible, true);
    for (let project = 0; project < 5; project++) house.setProject(project);
    const disposed = new Set();
    resources.forEach((resource) =>
      resource.addEventListener("dispose", () => disposed.add(resource)),
    );
    house.dispose();
    assert.equal(scene.children.length, 0);
    assert.equal(
      disposed.size,
      resources.size,
      "Every used geometry, material and texture must be released",
    );
  } finally {
    globalThis.document = previousDocument;
  }
});
