"use client";

import { useEffect, useRef } from "react";
import { projects, skillGroups } from "../house/portfolio-data";
import cameraPath from "./camera-path.json";
import { createCameraSampler, tourTime } from "./camera-sampler";

// The supplied model and its authored camera route stay together. Portfolio
// content lives in ordinary HTML, so every link also works without WebGL.
export default function ReferenceHouseScene({
  travel,
  motion,
  projectIndex,
  onReady,
  onError,
  onProgress,
  onProjectSelect,
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
    let disposed = false;
    let cleanup = () => {};
    const request = new AbortController();

    async function start() {
      try {
        const [
          THREE,
          { GLTFLoader },
          { DRACOLoader },
          { RoomEnvironment },
          { RectAreaLightUniformsLib },
          { personalizeModel, loadSkillLogos },
        ] = await Promise.all([
          import("three"),
          import("three/addons/loaders/GLTFLoader.js"),
          import("three/addons/loaders/DRACOLoader.js"),
          import("three/addons/environments/RoomEnvironment.js"),
          import("three/addons/lights/RectAreaLightUniformsLib.js"),
          import("./personalize-model"),
        ]);
        if (disposed || !host.current) return;
        RectAreaLightUniformsLib.init();
        const container = host.current;
        const renderer = new THREE.WebGLRenderer({
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        renderer.shadowMap.autoUpdate = false;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setClearColor("#101b1d");
        renderer.domElement.setAttribute("aria-hidden", "true");
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const house = new THREE.Group();
        scene.add(house);
        const camera = new THREE.PerspectiveCamera(90, 1, 0.1, 30);
        const sampler = createCameraSampler(cameraPath);
        const draco = new DRACOLoader()
          .setDecoderPath("/draco/")
          .setWorkerLimit(2);
        const loader = new GLTFLoader().setDRACOLoader(draco);
        const pmrem = new THREE.PMREMGenerator(renderer);
        const roomEnvironment = new RoomEnvironment();
        const environment = pmrem.fromScene(roomEnvironment, 0.04);
        scene.environment = environment.texture;
        scene.environmentIntensity = 0.5;
        roomEnvironment.dispose();
        pmrem.dispose();

        let personalization;
        const resources = [];
        let frame = 0,
          previous = 0,
          current = travel.current;
        let displayedProject = -1,
          contextLost = false;
        let dragging = false,
          moved = false,
          startX = 0,
          startY = 0;
        let offsetX = 0,
          offsetY = 0,
          modelReady = false,
          sceneLoaded = false,
          needsRender = true;
        const pointer = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();
        const offset = new THREE.Quaternion();
        const rotation = new THREE.Euler();

        const resize = () => {
          const { width, height } = container.getBoundingClientRect();
          if (!width || !height) return;
          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          needsRender = true;
        };
        const lost = (event) => {
          event.preventDefault();
          contextLost = true;
          onError();
        };
        const down = (event) => {
          if (
            !motionRef.current ||
            event.button !== 0 ||
            event.pointerType !== "mouse"
          )
            return;
          dragging = true;
          moved = false;
          startX = event.clientX;
          startY = event.clientY;
          renderer.domElement.setPointerCapture(event.pointerId);
        };
        const move = (event) => {
          if (!dragging) return;
          const dx = event.clientX - startX,
            dy = event.clientY - startY;
          if (Math.hypot(dx, dy) > 4) moved = true;
          offsetX = THREE.MathUtils.clamp(dy * 0.001, -0.2, 0.2);
          offsetY = THREE.MathUtils.clamp(dx * 0.001, -0.35, 0.35);
        };
        const up = (event) => {
          dragging = false;
          if (renderer.domElement.hasPointerCapture(event.pointerId))
            renderer.domElement.releasePointerCapture(event.pointerId);
          if (
            moved ||
            !personalization ||
            travel.current < 4.8 ||
            travel.current > 5.3
          )
            return;
          const rect = container.getBoundingClientRect();
          pointer.set(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            (-(event.clientY - rect.top) / rect.height) * 2 + 1,
          );
          raycaster.setFromCamera(pointer, camera);
          const hit = raycaster.intersectObjects(
            personalization.targets,
            false,
          )[0];
          if (hit) onProjectSelect(hit.object.userData.projectIndex);
        };
        const cancel = () => {
          dragging = false;
          moved = false;
        };
        const visibility = () => {
          if (!document.hidden && sceneLoaded && !contextLost) {
            previous = 0;
            needsRender = true;
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(render);
          }
        };
        const observer = new ResizeObserver(resize);
        observer.observe(container);
        resize();
        const canvas = renderer.domElement;
        canvas.addEventListener("webglcontextlost", lost);
        canvas.addEventListener("pointerdown", down);
        canvas.addEventListener("pointermove", move);
        canvas.addEventListener("pointerup", up);
        canvas.addEventListener("pointercancel", cancel);
        document.addEventListener("visibilitychange", visibility);
        cleanup = () => {
          cancelAnimationFrame(frame);
          observer.disconnect();
          canvas.removeEventListener("webglcontextlost", lost);
          canvas.removeEventListener("pointerdown", down);
          canvas.removeEventListener("pointermove", move);
          canvas.removeEventListener("pointerup", up);
          canvas.removeEventListener("pointercancel", cancel);
          document.removeEventListener("visibilitychange", visibility);
          personalization?.dispose();
          resources.forEach((resource) => resource.dispose());
          environment.dispose();
          draco.dispose();
          renderer.dispose();
          canvas.remove();
        };

        const logos = loadSkillLogos(request.signal);
        // Read the local model with real byte progress and abort on navigation.
        const response = await fetch("/models/portfolio-house.glb", {
          signal: request.signal,
        });
        if (!response.ok)
          throw new Error(`House asset returned ${response.status}`);
        const total =
          Number(response.headers.get("content-length")) || 23714808;
        const reader = response.body.getReader();
        const chunks = [];
        let received = 0,
          lastPercent = -1;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          received += value.length;
          const percent = Math.min(88, Math.floor((received / total) * 88));
          if (percent !== lastPercent && !disposed) {
            lastPercent = percent;
            onProgress(percent);
          }
        }
        const bytes = new Uint8Array(received);
        let cursor = 0;
        for (const chunk of chunks) {
          bytes.set(chunk, cursor);
          cursor += chunk.length;
        }
        chunks.length = 0;
        const gltf = await loader.parseAsync(bytes.buffer, "/models/");
        // A load can finish after React unmounts, including during Strict Mode.
        personalization = personalizeModel(
          gltf.scene,
          projects,
          skillGroups,
          await logos,
        );
        if (disposed) {
          personalization.dispose();
          return;
        }
        onProgress(94);
        house.add(gltf.scene);
        personalization.selectProject(projectRef.current);

        const sunGeometry = new THREE.SphereGeometry(2, 24, 16);
        const sunMaterial = new THREE.MeshBasicMaterial({
          color: "#fcfaea",
          toneMapped: false,
        });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.position.set(-3.8, 2, 14);
        house.add(sun);
        const beamGeometry = new THREE.ConeGeometry(3, 4.7, 15, 1, true);
        const beamMaterial = new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 0.06,
          depthWrite: false,
          color: "#f2c183",
        });
        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        beam.position.set(-3.9, 1.5, 11.9);
        house.add(beam);
        resources.push(sunGeometry, sunMaterial, beamGeometry, beamMaterial);

        const light = new THREE.DirectionalLight("#f2c183", 6);
        light.position.set(-2, 5, 6.5);
        light.castShadow = true;
        light.shadow.mapSize.set(1024, 1024);
        light.shadow.bias = -0.002;
        Object.assign(light.shadow.camera, {
          left: -10,
          right: 10,
          top: 10,
          bottom: -10,
          near: 0.1,
          far: 25,
        });
        house.add(light, light.target, new THREE.AmbientLight("#e8b880", 3));
        resources.push(light.shadow);
        const windowLight = new THREE.RectAreaLight("#f2c183", 6, 5.8, 5.8);
        windowLight.position.set(-3.8, 1.9, 12);
        house.add(windowLight);
        const deskLight = new THREE.PointLight("#f3e914", 0.25, 2.5, 10);
        deskLight.position.set(-0.2, 1.8, -11.5);
        house.add(deskLight);
        // Match the reference's Center wrapper, including the sun and light beam.
        const center = new THREE.Box3()
          .setFromObject(house)
          .getCenter(new THREE.Vector3());
        house.position.copy(center).negate();
        house.updateMatrixWorld(true);
        renderer.shadowMap.needsUpdate = true;

        function render(now) {
          if (disposed || document.hidden || contextLost) return;
          frame = requestAnimationFrame(render);
          if (previous && now - previous < 1000 / 30) return;
          const dt = Math.min((now - (previous || now)) / 1000, 0.05);
          previous = now;
          const animate = motionRef.current;
          const target = animate ? travel.current : Math.round(travel.current);
          // The rooms are static. Keep watching for scroll, but avoid redrawing
          // the entire house while a visitor is reading a settled view.
          if (
            modelReady &&
            !needsRender &&
            !dragging &&
            Math.abs(current - target) < 0.0001 &&
            Math.abs(offsetX) + Math.abs(offsetY) < 0.0001 &&
            displayedProject === projectRef.current
          )
            return;
          current = animate
            ? THREE.MathUtils.damp(current, target, 2.2, dt)
            : target;
          const pose = sampler(tourTime(current));
          camera.position.set(
            pose.position.x,
            pose.position.y,
            pose.position.z,
          );
          camera.rotation.set(
            pose.rotation.x,
            pose.rotation.y,
            pose.rotation.z,
            "XYZ",
          );
          if (!dragging || !animate) {
            offsetX *= 0.83;
            offsetY *= 0.83;
          }
          if (animate) {
            offset.setFromEuler(rotation.set(offsetX, offsetY, 0));
            camera.quaternion.multiply(offset);
          }
          camera.fov = pose.fov;
          camera.zoom = pose.zoom;
          camera.near = pose.near;
          camera.far = Math.max(pose.far, pose.near + 0.1);
          camera.updateProjectionMatrix();
          if (displayedProject !== projectRef.current) {
            displayedProject = projectRef.current;
            personalization.selectProject(displayedProject);
          }
          renderer.render(scene, camera);
          needsRender = false;
          if (!modelReady) {
            modelReady = true;
            onProgress(100);
            onReady();
          }
        }
        // Compile before revealing the view to prevent a blank first frame.
        const initial = sampler(tourTime(travel.current));
        camera.position.set(
          initial.position.x,
          initial.position.y,
          initial.position.z,
        );
        camera.rotation.set(
          initial.rotation.x,
          initial.rotation.y,
          initial.rotation.z,
        );
        await renderer.compileAsync(scene, camera);
        if (!disposed) {
          sceneLoaded = true;
          frame = requestAnimationFrame(render);
        }
      } catch (error) {
        if (!disposed) {
          console.error("Portfolio house could not load:", error);
          cleanup();
          cleanup = () => {};
          onError();
        }
      }
    }
    start();
    return () => {
      disposed = true;
      request.abort();
      cleanup();
    };
  }, [travel, onReady, onError, onProgress, onProjectSelect]);

  return <div ref={host} className="house-canvas" aria-hidden="true" />;
}
