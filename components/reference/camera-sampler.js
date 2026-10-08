const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const cubic = (t, a, b) =>
  3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3;

// Theatre keyframes store the incoming and outgoing Bezier handles per key.
export function sampleTrack(keys, position) {
  if (!keys?.length) return undefined;
  if (position <= keys[0].position) return keys[0].value;
  if (position >= keys.at(-1).position) return keys.at(-1).value;
  const index = keys.findIndex((key) => key.position > position);
  const a = keys[index - 1],
    b = keys[index];
  if (!a.connectedRight || a.type === "hold") return a.value;
  const fraction = (position - a.position) / (b.position - a.position);
  let low = 0,
    high = 1,
    t = fraction;
  for (let i = 0; i < 16; i++) {
    t = (low + high) / 2;
    if (cubic(t, a.handles?.[2] ?? 1 / 3, b.handles?.[0] ?? 2 / 3) < fraction)
      low = t;
    else high = t;
  }
  return (
    a.value +
    (b.value - a.value) *
      cubic(t, a.handles?.[3] ?? 1 / 3, b.handles?.[1] ?? 2 / 3)
  );
}

export const tourTimes = [0, 1.133, 3.467, 4.467, 6.833, 9.2, 9.867];
export function tourTime(progress) {
  const p = clamp(progress, 0, tourTimes.length - 1);
  const i = Math.min(tourTimes.length - 2, Math.floor(p));
  return tourTimes[i] + (tourTimes[i + 1] - tourTimes[i]) * (p - i);
}

export function createCameraSampler(state) {
  const sheet = state.sheetsById.Scene;
  const data = sheet.sequence.tracksByObject.Camera;
  const tracks = Object.entries(data.trackIdByPropPath).map(([path, id]) => ({
    path: JSON.parse(path),
    keys: data.trackData[id].keyframes,
  }));
  return (position) => {
    const result = {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      fov: 90,
      zoom: 0.65,
      near: 0.1,
      far: 30,
    };
    for (const { path, keys } of tracks) {
      const value = sampleTrack(keys, position);
      if (path.length === 2) result[path[0]][path[1]] = value;
      else result[path[0]] = value;
    }
    return result;
  };
}
