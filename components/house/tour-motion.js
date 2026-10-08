export const smooth = (t) => t * t * (3 - 2 * t);
const clamp = (t) => Math.max(0, Math.min(1, t));
const lerp = (a, b, t) => a + (b - a) * t;

export const cameraStops = [
  { position: [14.8, 11.8, 18.5], target: [-0.3, 2.1, 0.3], fov: 38 },
  { position: [8.7, 7.3, 12.8], target: [-1.6, 1.3, 0], fov: 37 },
  { position: [10.5, 7, 12.5], target: [1.1, 1.4, -0.1], fov: 35 },
  { position: [8.2, 10.4, 12], target: [-1.7, 4.7, -0.3], fov: 36 },
  { position: [10, 10.6, 12.7], target: [1.7, 4.8, -0.3], fov: 35 },
  { position: [10.5, 10.4, 14], target: [0.2, 4.5, 0.9], fov: 36 },
  { position: [5.5, 8.8, 13.5], target: [-3.2, 1.7, 1], fov: 39 },
];
export const walkStops = [
  [0, 0.08, 8.1],
  [-2, 0.62, 1.9],
  [2.2, 0.62, 1.7],
  [-2.1, 3.89, 0.8],
  [2.4, 3.89, 1.4],
  [1, 3.89, 2.7],
  [-5.5, 0.63, 2.7],
];

// Walk through the door, around the stairwell, and along the stair treads.
// Return a position separately from the renderer so continuity can be checked.
export function visitorPosition(progress) {
  const value = Math.max(0, Math.min(6, progress));
  const index = Math.min(5, Math.floor(value));
  const local = Math.min(1, value - index);
  if (index === 0)
    return [
      -2 * smooth(clamp((local - 0.82) / 0.18)),
      lerp(0.08, 0.62, smooth(clamp((local - 0.61) / 0.14))),
      lerp(8.1, 1.9, local),
    ];
  if (index === 2) {
    if (local < 0.22)
      return [lerp(2.2, 0, local / 0.22), 0.62, lerp(1.7, 2.4, local / 0.22)];
    if (local < 0.78) {
      const t = (local - 0.22) / 0.56;
      return [0, 0.62 + t * 3.27, 2.4 - t * 4.34];
    }
    const t = (local - 0.78) / 0.22;
    return [-2.1 * t, 3.89, lerp(-1.94, 0.8, t)];
  }
  if (index === 5) {
    if (local < 0.2) return [1, 3.89, lerp(2.7, -2.1, local * 5)];
    if (local < 0.3)
      return [
        lerp(1, 0, (local - 0.2) * 10),
        3.89,
        lerp(-2.1, -1.94, (local - 0.2) * 10),
      ];
    if (local < 0.75) {
      const t = (local - 0.3) / 0.45;
      return [0, 3.89 - t * 3.27, -1.94 + t * 4.34];
    }
    const t = (local - 0.75) * 4;
    return [-5.5 * t, lerp(0.62, 0.63, t), lerp(2.4, 2.7, t)];
  }
  return walkStops[index].map((axis, i) =>
    lerp(axis, walkStops[index + 1][i], local),
  );
}
