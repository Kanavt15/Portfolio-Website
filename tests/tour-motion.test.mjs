import test from "node:test";
import assert from "node:assert/strict";
import { visitorPosition, walkStops } from "../components/house/tour-motion.js";

const distance = (a, b) => Math.hypot(...a.map((value, i) => value - b[i]));

test("the visitor reaches each room and stays within the tour at either end", () => {
  walkStops.forEach((position, i) =>
    assert.ok(distance(visitorPosition(i), position) < 1e-9),
  );
  assert.ok(distance(visitorPosition(-10), walkStops[0]) < 1e-9);
  assert.ok(distance(visitorPosition(10), walkStops.at(-1)) < 1e-9);
});

test("the complete walk has no jumps, including floor and room boundaries", () => {
  let previous = visitorPosition(0);
  for (let i = 1; i <= 6000; i++) {
    const current = visitorPosition(i / 1000);
    assert.ok(current.every(Number.isFinite));
    assert.ok(
      distance(previous, current) < 0.05,
      `Unexpected jump at ${i / 1000}`,
    );
    previous = current;
  }
});

test("the visitor enters through the front door before turning into the living room", () => {
  const atDoor = (8.1 - 3.3) / (8.1 - 1.9);
  const [x, y, z] = visitorPosition(atDoor);
  assert.ok(Math.abs(x) < 1e-9);
  assert.ok(y >= 0.6);
  assert.ok(Math.abs(z - 3.3) < 1e-9);
});

test("ascending and descending follow the staircase rather than passing through a floor", () => {
  for (let i = 0; i <= 100; i++) {
    const up = visitorPosition(2.22 + (0.56 * i) / 100);
    const down = visitorPosition(5.3 + (0.45 * i) / 100);
    assert.ok(Math.abs(up[0]) < 1e-9);
    assert.ok(Math.abs(down[0]) < 1e-9);
    assert.ok(Math.abs(up[1] + down[1] - 4.51) < 1e-9);
    assert.ok(Math.abs(up[2] + down[2] - 0.46) < 1e-9);
  }
});
