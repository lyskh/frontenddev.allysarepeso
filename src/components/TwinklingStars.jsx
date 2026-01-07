import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reduced;
}

export default function TwinklingStars({
  count = 1200,
  radius = 12,
  size = 0.025,
  twinkleSpeed = 1.2,
  parallaxStrength = 0.04,
  shootingStars = true,
  shootingEvery = 5,
}) {
  const reducedMotion = usePrefersReducedMotion();
  const group = useRef();
  const meshRef = useRef();
  const phases = useRef();
  const speeds = useRef();
  const baseScale = useRef();
  const positions = useRef();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const starCount = isMobile ? Math.max(200, Math.floor(count * 0.45)) : count;

  const [shooters] = useState(() =>
    Array.from({ length: 5 }, () => ({
      active: false,
      pos: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      life: 0,
      ttl: 0,
    }))
  );

  const geometry = useMemo(() => new THREE.OctahedronGeometry(size * 1.2), [size]);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#e6f4ff",
        emissive: "#eaf7ff",
        emissiveIntensity: 0.28,
        roughness: 0.34,
        metalness: 0.05,
        transparent: true,
        depthWrite: false,
        opacity: 0.75,
      }),
    [size]
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempPosition = useMemo(() => new THREE.Vector3(), []);

  useMemo(() => {
    positions.current = new Float32Array(starCount * 3);
    phases.current = new Float32Array(starCount);
    speeds.current = new Float32Array(starCount);
    baseScale.current = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const r = radius * (0.35 + Math.random() * 0.65);
      positions.current[i3] = (Math.random() * 2 - 1) * r;
      positions.current[i3 + 1] = (Math.random() * 2 - 1) * r;
      positions.current[i3 + 2] = (Math.random() * 2 - 1) * r;
      phases.current[i] = Math.random() * Math.PI * 2;
      speeds.current[i] = 0.6 + Math.random() * 0.8;
      baseScale.current[i] = 0.6 + Math.random() * 0.8;
    }
  }, [starCount, radius]);

  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      tempPosition.set(positions.current[i3], positions.current[i3 + 1], positions.current[i3 + 2]);
      const scale = baseScale.current[i];
      tempMatrix.makeScale(scale, scale, scale);
      tempMatrix.setPosition(tempPosition);
      meshRef.current.setMatrixAt(i, tempMatrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [starCount, tempMatrix, tempPosition]);

  const target = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      target.current.x = x;
      target.current.y = y;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const shooterGeometry = useMemo(() => new THREE.ConeGeometry(0.05, 0.5, 6, 1, true), []);
  const shooterMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#9ae6ff", transparent: true, opacity: 0.85 }),
    []
  );
  useEffect(() => () => shooterGeometry.dispose(), [shooterGeometry]);
  useEffect(() => () => shooterMaterial.dispose(), [shooterMaterial]);

  useFrame(({ clock }, delta) => {
    if (!meshRef.current || !group.current) return;
    const t = clock.elapsedTime;

    // Parallax
    const px = target.current.x * parallaxStrength;
    const py = target.current.y * parallaxStrength;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, px, 3, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, py, 3, delta);

    for (let i = 0; i < starCount; i++) {
      const tw = reducedMotion
        ? 1
        : 0.6 + Math.sin(t * twinkleSpeed * speeds.current[i] + phases.current[i]) * 0.4;
      const scale = baseScale.current[i] * tw;
      const i3 = i * 3;
      tempPosition.set(positions.current[i3], positions.current[i3 + 1], positions.current[i3 + 2]);
      tempMatrix.makeScale(scale, scale, scale);
      tempMatrix.setPosition(tempPosition);
      meshRef.current.setMatrixAt(i, tempMatrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;

    // Shooting stars
    if (shootingStars && !reducedMotion) {
      if (Math.random() < delta / shootingEvery) {
        const s = shooters.find((sh) => !sh.active);
        if (s) {
          s.active = true;
          s.life = 0;
          s.ttl = 0.8 + Math.random() * 0.6;
          s.pos.set((Math.random() - 0.5) * radius, Math.random() * radius * 0.4, radius * 0.8);
          s.dir
            .set(-1 - Math.random() * 0.4, -0.1 + Math.random() * 0.3, -1.2 - Math.random())
            .normalize();
        }
      }
      shooters.forEach((s) => {
        if (!s.active) return;
        s.life += delta;
        s.pos.addScaledVector(s.dir, delta * radius * 2.4);
        if (s.life >= s.ttl) s.active = false;
      });
    }
  });

  return (
    <group ref={group} position={[0, 0, -2]}>
      <instancedMesh ref={meshRef} args={[geometry, material, starCount]} />
      {shootingStars &&
        !reducedMotion &&
        shooters.map(
          (s, i) =>
            s.active && (
              <mesh key={i} geometry={shooterGeometry} material={shooterMaterial} position={s.pos} />
            )
        )}
    </group>
  );
}
