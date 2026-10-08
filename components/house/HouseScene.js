"use client";

import { useEffect, useRef } from "react";
import {
  cameraStops as CAMERA_STOPS,
  walkStops as WALK_STOPS,
  smooth,
  visitorPosition,
} from "./tour-motion";

export default function HouseScene({
  travel,
  motion,
  projectIndex,
  onReady,
  onError,
}) {
  const host = useRef(null);
  const motionRef = useRef(motion);
  const projectRef = useRef(projectIndex);
  useEffect(() => {
    motionRef.current = motion;
  }, [motion]);
  useEffect(() => {
    projectRef.current = projectIndex;
  }, [projectIndex]);

  useEffect(() => {
    let disposed = false,
      cleanup;
    async function start() {
      try {
        const [THREE, { createHouse }] = await Promise.all([
          import("three"),
          import("./create-house"),
        ]);
        if (disposed || !host.current) return;
        const container = host.current;
        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        });
        renderer.setPixelRatio(
          Math.min(
            window.devicePixelRatio,
            window.innerWidth < 760 ? 1.25 : 1.5,
          ),
        );
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.35;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setClearColor(0x000000, 0);
        renderer.domElement.setAttribute("aria-hidden", "true");
        container.appendChild(renderer.domElement);
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog("#e5ece5", 38, 78);
        scene.add(new THREE.HemisphereLight("#f3f2df", "#6c8060", 2.6));
        const sun = new THREE.DirectionalLight("#fff1cf", 3.7);
        sun.position.set(-6, 16, 11);
        sun.castShadow = true;
        const shadowSize = window.innerWidth < 760 ? 1024 : 2048;
        sun.shadow.mapSize.set(shadowSize, shadowSize);
        Object.assign(sun.shadow.camera, {
          left: -14,
          right: 14,
          top: 14,
          bottom: -14,
          near: 1,
          far: 45,
        });
        sun.shadow.bias = -0.0005;
        sun.shadow.normalBias = 0.045;
        scene.add(sun);
        const fill = new THREE.DirectionalLight("#c1d9db", 1.4);
        fill.position.set(10, 8, -6);
        scene.add(fill);
        const house = createHouse(scene);
        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 120);
        camera.position.set(...CAMERA_STOPS[0].position);
        const lookAt = new THREE.Vector3(...CAMERA_STOPS[0].target);
        const desiredPosition = new THREE.Vector3(),
          desiredLook = new THREE.Vector3();
        const personPosition = new THREE.Vector3(...WALK_STOPS[0]);
        let frame = 0,
          previous = 0,
          current = 0,
          lastTravel = 0,
          gait = 0,
          revealed = false,
          contextLost = false,
          displayedProject = 0;
        const pointer = { x: 0, y: 0 };
        const resize = () => {
          const { width, height } = container.getBoundingClientRect();
          if (!width || !height) return;
          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        };
        const move = (e) => {
          pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
          pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        const lost = (e) => {
          e.preventDefault();
          contextLost = true;
          onError();
        };
        const visibility = () => {
          if (!document.hidden && !contextLost) {
            previous = 0;
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(render);
          }
        };
        const observer = new ResizeObserver(resize);
        observer.observe(container);
        resize();
        window.addEventListener("pointermove", move, { passive: true });
        document.addEventListener("visibilitychange", visibility);
        renderer.domElement.addEventListener("webglcontextlost", lost);
        function render(now) {
          if (disposed || document.hidden || contextLost) return;
          if (previous && now - previous < 1000 / 30) {
            frame = requestAnimationFrame(render);
            return;
          }
          const dt = Math.min((now - (previous || now)) / 1000, 0.05);
          previous = now;
          const animate = motionRef.current;
          if (displayedProject !== projectRef.current) {
            displayedProject = projectRef.current;
            house.setProject(displayedProject);
          }
          current = animate
            ? THREE.MathUtils.damp(current, travel.current, 4.5, dt)
            : travel.current;
          const index = Math.min(5, Math.floor(current)),
            t = smooth(Math.min(1, current - index));
          const a = CAMERA_STOPS[index],
            b = CAMERA_STOPS[index + 1];
          desiredPosition
            .fromArray(a.position)
            .lerp(new THREE.Vector3(...b.position), t);
          desiredLook
            .fromArray(a.target)
            .lerp(new THREE.Vector3(...b.target), t);
          if (window.innerWidth < 760) {
            desiredPosition.multiplyScalar(1.16);
            desiredPosition.y -= 0.4;
          }
          if (animate) {
            desiredPosition.x += pointer.x * 0.22;
            desiredPosition.y += pointer.y * 0.1;
          }
          camera.position.lerp(
            desiredPosition,
            animate ? 1 - Math.exp(-4 * dt) : 1,
          );
          lookAt.lerp(desiredLook, animate ? 1 - Math.exp(-4 * dt) : 1);
          camera.fov = THREE.MathUtils.lerp(a.fov, b.fov, t);
          camera.updateProjectionMatrix();
          camera.lookAt(lookAt);
          const enter = smooth(Math.min(1, current / 0.85));
          house.roof.position.y = 6.9 + enter * 3.7;
          house.opacity(house.roof, 1 - enter);
          house.opacity(house.shell, 1 - enter * 0.985);
          house.door.rotation.y = -enter * 1.5;
          const upstairs =
            smooth(THREE.MathUtils.clamp((current - 2.25) / 0.65, 0, 1)) *
            (1 - smooth(THREE.MathUtils.clamp(current - 5, 0, 1)));
          const downstairs = enter * (1 - upstairs);
          house.opacity(house.upperFloor, 1 - downstairs * 0.94);
          house.opacity(house.upperFurniture, 1 - downstairs * 0.9);
          // A continuous walk includes the actual stairway between floors.
          personPosition.fromArray(visitorPosition(current));
          const velocity = house.visitor.position.distanceTo(personPosition);
          if (velocity > 0.002) {
            const angle = Math.atan2(
              personPosition.x - house.visitor.position.x,
              personPosition.z - house.visitor.position.z,
            );
            house.visitor.rotation.y = angle;
          }
          house.visitor.position.copy(personPosition);
          const moving = animate && Math.abs(current - lastTravel) > 0.0002;
          if (moving) gait += dt * 11;
          for (const { leg, arm, side } of house.limbs) {
            const swing = moving ? Math.sin(gait) * 0.48 * side : 0;
            leg.rotation.x = THREE.MathUtils.damp(
              leg.rotation.x,
              swing,
              12,
              dt,
            );
            arm.rotation.x = THREE.MathUtils.damp(
              arm.rotation.x,
              -swing * 0.7,
              12,
              dt,
            );
          }
          lastTravel = current;
          renderer.render(scene, camera);
          if (!revealed) {
            revealed = true;
            onReady();
          }
          frame = requestAnimationFrame(render);
        }
        frame = requestAnimationFrame(render);
        cleanup = () => {
          cancelAnimationFrame(frame);
          observer.disconnect();
          window.removeEventListener("pointermove", move);
          document.removeEventListener("visibilitychange", visibility);
          renderer.domElement.removeEventListener("webglcontextlost", lost);
          house.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
      } catch (error) {
        console.error("The house scene could not start:", error);
        if (!disposed) onError();
      }
    }
    start();
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [travel, onReady, onError]);

  return (
    <div
      className="house-canvas"
      ref={host}
      role="img"
      aria-label="A furnished two-story country house. A visitor walks between portfolio rooms as you scroll."
    />
  );
}
