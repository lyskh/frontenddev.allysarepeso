import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import TwinklingStars from "./TwinklingStars";

function usePrefersReducedMotion() {
  const ref = useRef(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => (ref.current = media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return ref;
}

function useScrollProgress() {
  const progress = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const h = Math.max(1, window.innerHeight);
      progress.current = Math.min(1, Math.max(0, window.scrollY / h));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

function ParallaxLayer({ color = "#1b2a44", position = [0, 0, -1.5], factor = 0.6, size = 0.8, reducedMotion }) {
  const group = useRef();
  const mesh = useRef();
  const scroll = useScrollProgress();

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(size, 0), [size]);
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.05, emissive: "#0a0f1e", emissiveIntensity: 0.08 }),
    [color]
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame(({ clock }, delta) => {
    if (!group.current || !mesh.current) return;
    const targetX = scroll.current * factor;
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, targetX, 4, delta);
    group.current.position.y = position[1];
    group.current.position.z = position[2];

    if (reducedMotion?.current) {
      mesh.current.rotation.y = 0.06;
      material.emissiveIntensity = THREE.MathUtils.damp(material.emissiveIntensity, 0.06, 3, delta);
      return;
    }

    mesh.current.rotation.y += 0.06 * delta * 60 * 0.2; // subtle spin
    material.emissiveIntensity = THREE.MathUtils.damp(material.emissiveIntensity, 0.12 + scroll.current * 0.08, 3, delta);
  });

  return (
    <group ref={group} position={position}>
      <mesh ref={mesh} geometry={geometry} material={material} />
    </group>
  );
}

export default function HeroScene() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <group>
      <TwinklingStars count={1400} radius={14} size={0.025} twinkleSpeed={1.1} parallaxStrength={0.05} shootingStars={!reducedMotion?.current} />

      {/* Background parallax accents */}
      <ParallaxLayer color="#0f172a" position={[-2.2, -0.2, -1.2]} factor={-0.8} size={0.9} reducedMotion={reducedMotion} />
      <ParallaxLayer color="#132036" position={[1.4, 0.1, -1.8]} factor={0.4} size={0.7} reducedMotion={reducedMotion} />
      <ParallaxLayer color="#162540" position={[-0.8, 0.4, -2.4]} factor={-0.2} size={0.6} reducedMotion={reducedMotion} />

      {/* Primary hero shape to the right */}
      <PrimaryShape position={[3.0, 0.3, 0]} scale={0.9} reducedMotion={reducedMotion} />
    </group>
  );
}

function PrimaryShape({ position = [3.0, 0.3, 0], scale = 0.9, reducedMotion }) {
  const mesh = useRef();
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 1), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: "#d4d4d8", wireframe: true }), []);
  const scroll = useScrollProgress();

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame(({ clock }, delta) => {
    if (!mesh.current) return;
    const baseY = position[1] ?? 0.3;

    if (reducedMotion?.current) {
      mesh.current.rotation.y = 0.12;
      mesh.current.position.y = baseY;
      return;
    }

    mesh.current.rotation.y = clock.elapsedTime * 0.2;
    mesh.current.position.y = baseY + Math.sin(clock.elapsedTime) * 0.18;

    // Subtle parallax nudge with scroll
    const targetX = position[0] + scroll.current * 0.4;
    mesh.current.position.x = THREE.MathUtils.damp(mesh.current.position.x, targetX, 6, delta);
  });

  return <mesh ref={mesh} position={position} scale={scale} geometry={geometry} material={material} />;
}
