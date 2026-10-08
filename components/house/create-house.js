import * as THREE from "three";

// The house is built locally: no remote model, texture, or animation downloads.
export function createHouse(scene) {
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const sphereGeometry = new THREE.SphereGeometry(1, 12, 10);
  const leafGeometry = new THREE.DodecahedronGeometry(1, 1);
  geometries.add(boxGeometry);
  geometries.add(sphereGeometry);
  geometries.add(leafGeometry);
  const palette = {
    plaster: "#e6e2d5",
    oak: "#9c7751",
    darkWood: "#554c36",
    stone: "#bbbca6",
    roof: "#3f5049",
    green: "#586d48",
    sage: "#8a9b70",
    deep: "#274d3b",
    fabric: "#d5d4b8",
    white: "#f4f1e5",
    brass: "#b99b57",
    ink: "#344843",
    clay: "#a87657",
    blue: "#6c8c91",
    skin: "#d5a079",
  };
  const materialCache = new Map();
  function mat(color, extra = {}) {
    const key = color + JSON.stringify(extra);
    if (!materialCache.has(key)) {
      const m = new THREE.MeshStandardMaterial({
        color: palette[color] || color,
        roughness: 0.85,
        ...extra,
      });
      materials.add(m);
      materialCache.set(key, m);
    }
    return materialCache.get(key);
  }
  function mesh(parent, geometry, material, position, scale) {
    const m = new THREE.Mesh(geometry, material);
    m.position.set(...position);
    if (scale) m.scale.set(...scale);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  function box(parent, size, position, color, extra) {
    return mesh(parent, boxGeometry, mat(color, extra), position, size);
  }
  function sphere(parent, size, position, color) {
    return mesh(parent, sphereGeometry, mat(color), position, size);
  }
  function cylinder(parent, top, bottom, height, position, color, sides = 14) {
    const g = new THREE.CylinderGeometry(top, bottom, height, sides);
    geometries.add(g);
    return mesh(parent, g, mat(color), position);
  }
  function group(parent, position = [0, 0, 0]) {
    const g = new THREE.Group();
    g.position.set(...position);
    parent.add(g);
    return g;
  }
  function beam(parent, from, to, radius, color) {
    const a = new THREE.Vector3(...from),
      b = new THREE.Vector3(...to);
    const m = cylinder(
      parent,
      radius,
      radius,
      a.distanceTo(b),
      a.clone().add(b).multiplyScalar(0.5).toArray(),
      color,
      8,
    );
    m.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      b.sub(a).normalize(),
    );
    return m;
  }
  let seed = 15;
  function random() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  function label(
    parent,
    text,
    position,
    width = 2.4,
    bg = "#e9e4d3",
    fg = "#344c3f",
  ) {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 768, 256);
    ctx.fillStyle = fg;
    ctx.font = "500 66px Georgia";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 384, 132);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    textures.add(texture);
    const m = new THREE.MeshBasicMaterial({ map: texture });
    materials.add(m);
    const geo = new THREE.PlaneGeometry(width, width / 3);
    geometries.add(geo);
    return mesh(parent, geo, m, position);
  }

  function plant(parent, x, y, z, scale = 1) {
    const g = group(parent, [x, y, z]);
    g.scale.setScalar(scale);
    cylinder(g, 0.24, 0.17, 0.4, [0, 0.2, 0], "clay");
    for (let i = 0; i < 6; i++) {
      const a = i * 2.4;
      beam(
        g,
        [0, 0.35, 0],
        [Math.cos(a) * 0.35, 0.8 + (i % 3) * 0.19, Math.sin(a) * 0.35],
        0.018,
        "deep",
      );
      const leaf = sphere(
        g,
        [0.16, 0.35, 0.075],
        [Math.cos(a) * 0.3, 0.8 + (i % 3) * 0.19, Math.sin(a) * 0.3],
        i % 2 ? "green" : "deep",
      );
      leaf.rotation.set(0.3, a, -0.5);
    }
    return g;
  }
  function tree(parent, x, z, scale, variant = 0) {
    const g = group(parent, [x, 0.04, z]);
    g.scale.setScalar(scale);
    cylinder(g, 0.12, 0.2, 2.5, [0, 1.25, 0], "darkWood", 8);
    for (let i = 0; i < 4; i++) {
      const a = i * 2.4;
      beam(
        g,
        [0, 1.5, 0],
        [Math.cos(a) * 0.75, 2.9, Math.sin(a) * 0.75],
        0.07,
        "darkWood",
      );
      const foliage = mesh(
        g,
        leafGeometry,
        mat(variant ? "#6f8662" : i % 2 ? "#72905c" : "#617f50"),
        [Math.cos(a) * 0.55, 3 + random() * 0.5, Math.sin(a) * 0.5],
        [0.95, 1.15, 0.9],
      );
      foliage.rotation.y = a;
    }
  }
  function bookcase(parent, x, y, z, width = 2.4) {
    const g = group(parent, [x, y, z]);
    box(g, [width, 2.6, 0.12], [0, 1.3, -0.16], "darkWood");
    [-width / 2, width / 2].forEach((v) =>
      box(g, [0.1, 2.6, 0.4], [v, 1.3, 0], "oak"),
    );
    for (let row = 0; row < 4; row++) {
      box(g, [width, 0.09, 0.45], [0, row * 0.63 + 0.1, 0], "oak");
      for (let col = 0; col < 9; col++) {
        const h = 0.28 + random() * 0.23;
        const b = box(
          g,
          [0.12 + random() * 0.05, h, 0.23],
          [
            -width / 2 + 0.24 + (col * (width - 0.4)) / 9,
            row * 0.63 + 0.15 + h / 2,
            0.04,
          ],
          ["sage", "clay", "blue", "white", "darkWood"][col % 5],
        );
        b.rotation.z = col === 2 ? -0.12 : 0;
      }
    }
  }
  function chair(parent, x, y, z, rotation = 0) {
    const g = group(parent, [x, y, z]);
    g.rotation.y = rotation;
    box(g, [0.65, 0.13, 0.65], [0, 0.57, 0], "fabric");
    box(g, [0.65, 0.7, 0.12], [0, 0.94, -0.28], "oak");
    for (const a of [-0.25, 0.25])
      for (const b of [-0.25, 0.25])
        box(g, [0.065, 0.55, 0.065], [a, 0.275, b], "darkWood");
    return g;
  }
  function lamp(parent, x, y, z) {
    cylinder(parent, 0.25, 0.3, 0.07, [x, y + 0.04, z], "brass");
    cylinder(parent, 0.025, 0.025, 1.9, [x, y + 1, z], "brass", 8);
    cylinder(parent, 0.28, 0.43, 0.45, [x, y + 1.95, z], "white");
    sphere(parent, [0.15, 0.12, 0.15], [x, y + 1.7, z], "white");
  }
  function frame(parent, x, y, z, text, color = "#e8e2ce", width = 1.3) {
    box(parent, [width + 0.14, width * 0.78 + 0.14, 0.1], [x, y, z], "oak");
    label(parent, text, [x, y, z + 0.058], width, color);
  }
  const world = group(scene);
  const landscape = group(world);
  // Softly bevelled circular lawn, with a fine stone edge.
  cylinder(landscape, 10.8, 10.5, 0.4, [0, -0.23, 0], "#a5b38b", 96);
  cylinder(landscape, 10.9, 10.7, 0.13, [0, -0.47, 0], "#d0d2bc", 96);
  for (let i = 0; i < 26; i++) {
    const a = i * 2.4,
      radius = 7.1 + random() * 2.8;
    const x = Math.cos(a) * radius,
      z = Math.sin(a) * radius;
    if (z > 3 && Math.abs(x) < 3.5) continue;
    tree(landscape, x, z, 0.65 + random() * 0.5, i % 3 === 0);
  }
  // Distant rolling countryside, intentionally low contrast.
  const hills = group(world);
  for (let i = 0; i < 7; i++) {
    const h = sphere(
      hills,
      [10 + (i % 3) * 3, 2.4 + (i % 2), 6],
      [-24 + i * 8, -1.5, -17 - (i % 2) * 4],
      i % 2 ? "#aab99b" : "#bdc9ae",
    );
    h.castShadow = false;
  }
  // The winding front walk is made from individual stone pavers.
  for (let i = 0; i < 12; i++) {
    const z = 3.6 + i * 0.5,
      x = Math.sin(i / 3) * 0.6;
    const paver = box(
      landscape,
      [1.1, 0.065, 0.37],
      [x, 0.03, z],
      i % 3 ? "#d0cbb6" : "#babda6",
    );
    paver.rotation.y = Math.cos(i / 3) * 0.17;
  }
  // Garden borders and white split-rail fencing.
  for (const side of [-1, 1]) {
    for (let i = 0; i < 6; i++) {
      box(
        landscape,
        [0.1, 0.78, 0.1],
        [side * (1.5 + i * 0.9), 0.39, 6.2],
        "white",
      );
      if (i < 5)
        for (const y of [0.28, 0.62])
          box(
            landscape,
            [0.92, 0.065, 0.065],
            [side * (1.95 + i * 0.9), y, 6.2],
            "white",
          );
    }
    box(landscape, [3.1, 0.18, 0.8], [side * 2.8, 0.09, 4.5], "stone");
    for (let i = 0; i < 9; i++) {
      const x = side * 2.8 - 1.2 + i * 0.3;
      sphere(
        landscape,
        [0.27, 0.3, 0.3],
        [x, 0.3, 4.5],
        i % 2 ? "green" : "sage",
      );
      for (let n = 0; n < 2; n++)
        sphere(
          landscape,
          [0.045, 0.065, 0.045],
          [x + random() * 0.2, 0.6, 4.4 + random() * 0.3],
          i % 3 ? "#e8dcc1" : "#b9a0ba",
        );
    }
  }
  box(landscape, [0.08, 0.9, 0.08], [1.45, 0.45, 7.8], "darkWood");
  box(landscape, [0.45, 0.26, 0.29], [1.45, 0.95, 7.8], "deep");
  box(landscape, [0.035, 0.28, 0.025], [1.7, 1.08, 7.8], "brass");

  const building = group(world);
  const shell = group(building);
  const roof = group(building, [0, 6.9, 0]);
  const ground = group(building, [0, 0.48, 0]);
  const upper = group(building, [0, 3.75, 0]);
  const upperFloor = group(upper);
  const upperFurniture = group(upper);
  box(building, [9, 0.45, 6.8], [0, 0.2, 0], "stone");
  box(ground, [8.7, 0.16, 6.5], [0, 0, 0], "oak");
  // An open stairwell connects the two floors.
  box(upperFloor, [3.85, 0.2, 6.5], [-2.425, 0, 0], "oak");
  box(upperFloor, [3.85, 0.2, 6.5], [2.425, 0, 0], "oak");
  box(upperFloor, [1, 0.2, 0.7], [0, 0, 2.9], "oak");
  box(upperFloor, [1, 0.2, 1.2], [0, 0, -2.65], "oak");
  for (let i = 0; i < 30; i++) {
    const x = -4.2 + i * 0.29;
    box(ground, [0.012, 0.008, 6.4], [x, 0.085, 0], "#795f44");
    if (Math.abs(x) > 0.5)
      box(upperFloor, [0.012, 0.008, 6.4], [x, 0.105, 0], "#795f44");
  }
  // Permanent back and west walls support the cutaway interiors.
  box(building, [8.85, 6.5, 0.18], [0, 3.7, -3.25], "plaster");
  box(building, [0.18, 3.2, 6.5], [-4.4, 5.3, 0], "plaster");
  box(building, [0.18, 3.2, 3.9], [-4.4, 2.1, -1.3], "plaster");
  box(building, [0.18, 0.3, 2.6], [-4.4, 3.6, 1.95], "darkWood");
  for (const y of [0.62, 3.86, 6.85])
    box(building, [8.9, 0.14, 0.2], [0, y, -3.12], "darkWood");
  for (const x of [-4.35, -0.2, 4.35])
    box(building, [0.16, 6.5, 0.18], [x, 3.7, -3.06], "darkWood");
  // A door-sized opening and glazed facade reveal a furnished house behind.
  for (const x of [-3.9, -1.1, 1.1, 3.9]) {
    box(shell, [0.32, 6.45, 0.3], [x, 3.7, 3.2], "stone");
  }
  box(shell, [8.8, 0.32, 0.3], [0, 3.65, 3.2], "darkWood");
  box(shell, [8.8, 0.25, 0.3], [0, 6.85, 3.2], "darkWood");
  for (const z of [-3.15, 0, 3.15])
    box(shell, [0.22, 6.45, 0.24], [4.4, 3.7, z], "stone");
  for (const y of [0.65, 3.65, 6.75])
    box(shell, [0.22, 0.28, 6.5], [4.4, y, 0], "darkWood");
  for (const y of [1.95, 5.18])
    for (const z of [-1.6, 1.6]) {
      box(shell, [0.035, 2.4, 2.75], [4.43, y, z], "#a8c9bc", {
        transparent: true,
        opacity: 0.22,
        roughness: 0.2,
        depthWrite: false,
      });
      box(shell, [0.09, 2.55, 0.065], [4.46, y, z], "darkWood");
      box(shell, [0.09, 0.065, 2.85], [4.46, y, z], "darkWood");
    }
  for (const y of [1.95, 5.18]) {
    for (const x of [-2.5, 2.5]) {
      box(shell, [2.35, 2.4, 0.035], [x, y, 3.22], "#a8c9bc", {
        transparent: true,
        opacity: 0.22,
        metalness: 0.15,
        roughness: 0.2,
        depthWrite: false,
      });
      box(shell, [0.065, 2.5, 0.09], [x, y, 3.25], "darkWood");
      box(shell, [2.5, 0.065, 0.09], [x, y, 3.25], "darkWood");
    }
  }
  const door = group(shell, [-0.87, 0.55, 3.3]);
  box(door, [1.7, 2.55, 0.12], [0.85, 1.275, 0], "deep");
  box(door, [1.28, 1.48, 0.02], [0.85, 1.6, 0.075], "#9fb8a4", {
    roughness: 0.25,
  });
  sphere(door, [0.05, 0.05, 0.05], [1.5, 1.05, 0.13], "brass");
  // Porch deck, steps, and roof brackets.
  box(building, [3, 0.15, 1.1], [0, 0.4, 3.65], "oak");
  box(building, [2, 0.15, 0.42], [0, 0.16, 4.1], "stone");
  for (const x of [-1.25, 1.25]) {
    box(building, [0.11, 2.85, 0.11], [x, 1.9, 3.95], "darkWood");
    beam(
      building,
      [x, 3.05, 3.95],
      [x > 0 ? x - 0.4 : x + 0.4, 3.5, 3.95],
      0.045,
      "oak",
    );
  }
  box(building, [3.3, 0.16, 1.5], [0, 3.4, 3.7], "roof");
  label(shell, "The Trivedi house", [0, 6.28, 3.38], 2.6);
  // Gabled standing-seam roof.
  const roofAngle = Math.atan2(1.85, 4.8);
  for (const side of [-1, 1]) {
    const panel = box(roof, [5.16, 0.18, 7.3], [side * 2.4, 0.92, 0], "roof");
    panel.rotation.z = -side * roofAngle;
    for (let i = 0; i < 19; i++) {
      const seam = box(
        roof,
        [5.18, 0.04, 0.035],
        [side * 2.4, 1.02, -3.55 + i * 0.395],
        "#58665b",
      );
      seam.rotation.z = -side * roofAngle;
    }
  }
  const triangle = new THREE.Shape();
  triangle.moveTo(-4.4, 0);
  triangle.lineTo(0, 1.85);
  triangle.lineTo(4.4, 0);
  triangle.closePath();
  const triGeo = new THREE.ExtrudeGeometry(triangle, {
    depth: 0.14,
    bevelEnabled: false,
  });
  geometries.add(triGeo);
  mesh(roof, triGeo, mat("plaster"), [0, 0, 3.2]);
  mesh(roof, triGeo, mat("plaster"), [0, 0, -3.35]);
  box(roof, [0.12, 1.8, 0.17], [0, 0.9, 3.4], "darkWood");
  for (const side of [-1, 1])
    beam(roof, [0, 1.78, 3.4], [side * 4.4, 0.05, 3.4], 0.07, "darkWood");
  box(roof, [0.85, 2.7, 0.9], [-2.7, 0.6, -1.5], "stone");
  box(roof, [1, 0.15, 1.05], [-2.7, 2, -1.5], "darkWood");

  // Living room: linen sofa, striped rug, coffee table, fireplace, art.
  box(ground, [3.15, 0.035, 2.5], [-2.2, 0.11, 0.8], "#a9b6a2");
  for (let i = 0; i < 8; i++)
    box(ground, [0.035, 0.006, 2.45], [-3.6 + i * 0.4, 0.131, 0.8], "#dedbc9");
  const sofa = group(ground, [-2.7, 0.12, -0.9]);
  box(sofa, [2.7, 0.45, 0.95], [0, 0.4, 0], "fabric");
  box(sofa, [2.75, 0.8, 0.2], [0, 0.7, -0.45], "fabric");
  for (const x of [-1.35, 1.35])
    box(sofa, [0.22, 0.68, 1], [x, 0.58, 0], "fabric");
  for (const x of [-0.85, 0, 0.85])
    box(sofa, [0.78, 0.13, 0.75], [x, 0.68, 0.06], "white");
  for (const x of [-0.9, 0.9]) {
    const pillow = box(
      sofa,
      [0.45, 0.45, 0.15],
      [x, 0.99, -0.24],
      x < 0 ? "green" : "clay",
    );
    pillow.rotation.z = x * 0.14;
  }
  cylinder(ground, 0.73, 0.73, 0.12, [-2.2, 0.65, 1.1], "oak", 40);
  for (const x of [-0.35, 0.35])
    for (const z of [-0.3, 0.3])
      box(ground, [0.06, 0.48, 0.06], [-2.2 + x, 0.35, 1.1 + z], "darkWood");
  box(ground, [0.42, 0.08, 0.3], [-2.35, 0.75, 1.1], "blue");
  cylinder(ground, 0.09, 0.07, 0.16, [-1.9, 0.8, 1.15], "white");
  lamp(ground, -3.9, 0.1, -1.2);
  plant(ground, -3.9, 0.1, 2.3, 1.2);
  frame(ground, -2.4, 2.1, -3.09, "Make room", "#d0d7bc", 1.9);
  box(ground, [0.5, 1.6, 1.4], [-4.14, 0.9, -1.8], "stone");
  box(ground, [0.06, 0.9, 0.9], [-3.86, 0.7, -1.8], "ink");
  box(ground, [0.75, 0.13, 1.65], [-4.02, 1.7, -1.8], "oak");

  // Project gallery: substantial plinths and three large illuminated displays.
  const gallery = group(ground);
  box(gallery, [3.75, 0.035, 3.1], [2.2, 0.12, 0.25], "#d4c5a4");
  frame(gallery, 2.2, 2.45, -3.09, "Selected work", "#344d43", 2.5);
  const displayCanvas = document.createElement("canvas");
  displayCanvas.width = 1024;
  displayCanvas.height = 640;
  const displayTexture = new THREE.CanvasTexture(displayCanvas);
  displayTexture.colorSpace = THREE.SRGBColorSpace;
  textures.add(displayTexture);
  const displayMaterial = new THREE.MeshBasicMaterial({ map: displayTexture });
  materials.add(displayMaterial);
  const displayGeometry = new THREE.PlaneGeometry(2.65, 1.65);
  geometries.add(displayGeometry);
  box(gallery, [2, 0.9, 0.8], [2.2, 0.57, -0.1], "plaster");
  box(gallery, [2.15, 0.07, 0.95], [2.2, 1.06, -0.1], "brass");
  box(gallery, [0.08, 0.38, 0.08], [2.2, 1.3, -0.1], "brass");
  box(gallery, [2.8, 1.8, 0.13], [2.2, 2.08, -0.1], "ink");
  mesh(gallery, displayGeometry, displayMaterial, [2.2, 2.08, -0.025]);
  for (const [x, text, color] of [
    [0.75, "Vanaspati", "#78945c"],
    [3.65, "CAD-C", "#978baa"],
  ]) {
    box(gallery, [0.75, 0.8, 0.55], [x, 0.52, -1.8], "plaster");
    box(gallery, [0.83, 0.7, 0.1], [x, 1.27, -1.8], "oak");
    label(gallery, text, [x, 1.27, -1.74], 0.76, color, "#ffffff");
  }
  function setProject(index) {
    const ctx = displayCanvas.getContext("2d");
    const names = ["ReFace", "Vanaspati", "Skill-Verse", "CAD-C", "SSTC"];
    const colors = ["#426e65", "#5f8051", "#887d59", "#796888", "#62745e"];
    ctx.fillStyle = colors[index];
    ctx.fillRect(0, 0, 1024, 640);
    ctx.strokeStyle = "#e5eed529";
    ctx.lineWidth = 1;
    for (let x = 0; x < 1024; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 640);
      ctx.stroke();
    }
    for (let y = 0; y < 640; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }
    ctx.strokeStyle = "#e4efd2";
    ctx.lineWidth = 2;
    if (index === 0) {
      const rows = [
        [0, 35],
        [65, 80],
        [130, 100],
        [195, 95],
        [260, 65],
        [310, 0],
      ];
      const points = rows.map(([y, w]) => [
        [512 - w, 75 + y],
        [512, 75 + y],
        [512 + w, 75 + y],
      ]);
      points.forEach((row, r) =>
        row.forEach(([x, y], c) => {
          ctx.beginPath();
          ctx.arc(x, y, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = "#e4efd2";
          ctx.fill();
          if (c < 2) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(...row[c + 1]);
            ctx.stroke();
          }
          if (r < points.length - 1) {
            for (const next of [c, Math.min(2, c + 1)]) {
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(...points[r + 1][next]);
              ctx.stroke();
            }
          }
        }),
      );
    } else if (index === 1) {
      ctx.beginPath();
      ctx.moveTo(512, 390);
      ctx.lineTo(512, 90);
      ctx.stroke();
      for (let i = 0; i < 6; i++) {
        const side = i % 2 ? 1 : -1;
        ctx.beginPath();
        ctx.ellipse(
          512 + side * 44,
          125 + i * 40,
          23,
          60,
          side * 0.8,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = "#c1d5a599";
        ctx.fill();
      }
    } else {
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(
          370 + i * 70,
          220 + Math.sin(i * 2) * 70,
          35 + i * 4,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
      }
    }
    ctx.font = "500 74px sans-serif";
    ctx.fillStyle = "#f1f4e7";
    ctx.textAlign = "center";
    ctx.fillText(names[index], 512, 520);
    ctx.font = "22px sans-serif";
    ctx.fillStyle = "#d8e4c8";
    ctx.fillText("Selected work · Kanav Trivedi", 512, 573);
    displayTexture.needsUpdate = true;
  }
  setProject(0);
  plant(gallery, 3.85, 0.1, 2.25, 1.2);
  // Warm suspended gallery lighting.
  for (const x of [0.8, 2.2, 3.55]) {
    cylinder(gallery, 0.012, 0.012, 0.6, [x, 2.8, -0.6], "darkWood", 6);
    cylinder(gallery, 0.08, 0.24, 0.18, [x, 2.45, -0.6], "brass");
  }

  // First-floor study: a real workspace with monitor, desk lamp and chair.
  box(upperFurniture, [3.5, 0.025, 2.7], [-2.25, 0.12, 0.2], "#b5b5a0");
  box(upperFurniture, [2.6, 0.14, 1.15], [-2.6, 1.05, -1.75], "oak");
  for (const x of [-3.7, -1.5])
    for (const z of [-2.18, -1.32])
      box(upperFurniture, [0.09, 1, 0.09], [x, 0.5, z], "darkWood");
  box(upperFurniture, [0.08, 0.4, 0.08], [-2.6, 1.3, -1.95], "ink");
  box(upperFurniture, [1.4, 0.86, 0.1], [-2.6, 1.85, -1.95], "ink");
  label(
    upperFurniture,
    "Hello, world.",
    [-2.6, 1.85, -1.89],
    1.29,
    "#344e49",
    "#c0d6b1",
  );
  box(upperFurniture, [0.75, 0.025, 0.25], [-2.6, 1.14, -1.4], "white");
  lamp(upperFurniture, -3.5, 1.12, -1.8);
  chair(upperFurniture, -2.55, 0.1, -0.5, Math.PI);
  plant(upperFurniture, -3.85, 0.1, 1.9, 1.25);
  frame(upperFurniture, -2.6, 2.6, -3.09, "Stay curious", "#c9d4bf", 1.65);
  bookcase(upperFurniture, -0.8, 0.1, -2.8, 1.3);

  // Library / experience room with books and an easy chair.
  bookcase(upperFurniture, 2.4, 0.1, -2.84, 3.3);
  chair(upperFurniture, 2.8, 0.1, 0.3, -0.5);
  cylinder(upperFurniture, 0.45, 0.45, 0.08, [1.6, 0.73, 0.55], "oak", 30);
  cylinder(upperFurniture, 0.04, 0.04, 0.65, [1.6, 0.36, 0.55], "brass");
  box(upperFurniture, [0.4, 0.08, 0.3], [1.6, 0.83, 0.55], "clay");
  lamp(upperFurniture, 3.8, 0.1, -0.4);
  plant(upperFurniture, 3.8, 0.1, 2, 1);
  box(upperFurniture, [3.1, 0.03, 2.5], [2.2, 0.11, 0.9], "#b8c6b2");
  // Front balcony guardrail and award cabinet.
  for (let i = 0; i < 13; i++)
    box(
      upperFurniture,
      [0.035, 0.72, 0.035],
      [-4.05 + i * 0.68, 0.48, 3.12],
      "darkWood",
    );
  box(upperFurniture, [8.4, 0.055, 0.07], [0, 0.85, 3.12], "oak");
  box(upperFurniture, [1.2, 0.65, 0.45], [0.1, 0.42, 1.9], "oak");
  for (const x of [-0.27, 0.15, 0.55]) {
    cylinder(upperFurniture, 0.12, 0.07, 0.2, [x, 0.92, 1.9], "brass");
    cylinder(upperFurniture, 0.035, 0.035, 0.17, [x, 0.77, 1.9], "brass");
    box(upperFurniture, [0.2, 0.05, 0.16], [x, 0.67, 1.9], "darkWood");
  }
  // Central open staircase; the visitor follows these treads upstairs.
  const stairs = group(building);
  for (let i = 0; i < 15; i++) {
    box(
      stairs,
      [0.85, 0.11, 0.3],
      [0, 0.65 + i * 0.216, 2.4 - i * 0.31],
      "oak",
    );
    if (i % 2 === 0)
      box(
        stairs,
        [0.035, 0.65, 0.035],
        [0.48, 0.95 + i * 0.216, 2.4 - i * 0.31],
        "darkWood",
      );
  }
  beam(stairs, [0.48, 1.35, 2.55], [0.48, 4.37, -1.85], 0.035, "darkWood");
  // The glazed sunroom extends into the garden.
  const sunroom = group(building, [-5.55, 0.45, 1.3]);
  box(sunroom, [2.1, 0.15, 3.7], [0, 0, 0], "oak");
  for (const x of [-1, 1])
    for (const z of [-1.8, 1.8])
      box(sunroom, [0.07, 2.8, 0.07], [x, 1.4, z], "deep");
  box(sunroom, [2.2, 0.1, 3.8], [0, 2.8, 0], "deep");
  box(sunroom, [2, 0.025, 3.6], [0, 2.87, 0], "#bad3bc", {
    transparent: true,
    opacity: 0.25,
    depthWrite: false,
  });
  chair(sunroom, 0, 0.1, 0.7, 0.2);
  plant(sunroom, -0.6, 0.1, -1.15, 1.5);
  plant(sunroom, 0.65, 0.1, -1.3, 1.05);
  cylinder(sunroom, 0.35, 0.35, 0.08, [0, 0.65, -0.25], "white");
  cylinder(sunroom, 0.05, 0.05, 0.55, [0, 0.32, -0.25], "oak");
  cylinder(sunroom, 0.07, 0.07, 0.13, [0, 0.76, -0.25], "clay");

  // An articulated visitor: the scroll path drives position and the walking cycle.
  const visitor = group(world, [0, 0.08, 8.1]);
  visitor.scale.setScalar(0.9);
  const torso = box(visitor, [0.38, 0.58, 0.25], [0, 0.91, 0], "blue");
  sphere(visitor, [0.17, 0.2, 0.17], [0, 1.4, 0], "skin");
  sphere(visitor, [0.18, 0.12, 0.18], [0, 1.53, -0.015], "darkWood");
  box(visitor, [0.28, 0.38, 0.12], [0, 0.98, -0.19], "clay");
  const limbs = [];
  for (const side of [-1, 1]) {
    const leg = group(visitor, [side * 0.11, 0.64, 0]);
    box(leg, [0.13, 0.55, 0.14], [0, -0.27, 0], "ink");
    box(leg, [0.15, 0.1, 0.25], [0, -0.57, 0.035], "white");
    const arm = group(visitor, [side * 0.26, 1.17, 0]);
    box(arm, [0.12, 0.44, 0.13], [0, -0.21, 0], "blue");
    sphere(arm, [0.07, 0.08, 0.07], [0, -0.47, 0], "skin");
    limbs.push({ leg, arm, side });
  }
  torso.rotation.z = -0.025;

  // Keep independently fading groups from sharing materials.
  for (const g of [shell, roof, upperFloor, upperFurniture]) {
    const clones = new Map();
    g.traverse((o) => {
      if (!o.isMesh) return;
      if (!clones.has(o.material)) {
        const m = o.material.clone();
        m.userData.baseOpacity = m.opacity;
        clones.set(o.material, m);
        materials.add(m);
      }
      o.material = clones.get(o.material);
    });
  }
  function opacity(g, value) {
    g.visible = value > 0.015;
    g.traverse((o) => {
      if (!o.isMesh) return;
      const m = o.material;
      m.opacity = (m.userData.baseOpacity ?? 1) * value;
      m.transparent = m.opacity < 0.995;
      m.depthWrite = m.opacity > 0.65;
      o.castShadow = value > 0.8;
    });
  }
  return {
    world,
    landscape,
    hills,
    roof,
    shell,
    door,
    upperFloor,
    upperFurniture,
    visitor,
    limbs,
    opacity,
    setProject,
    dispose() {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      scene.remove(world);
    },
  };
}
