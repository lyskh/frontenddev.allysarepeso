import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
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

function SkillBadge3D({ label, position = [0, 0, 0], color = "#89cff0" }) {
  const mesh = useRef();
  const [hovered, setHovered] = useState(false);

  const geometry = useMemo(() => new THREE.SphereGeometry(0.1, 12, 12), []);
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.06, emissive: "#0b1222", emissiveIntensity: 0.06 }),
    [color]
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    const targetScale = hovered ? 1.15 : 1;
    mesh.current.scale.x = THREE.MathUtils.damp(mesh.current.scale.x, targetScale, 6, delta);
    mesh.current.scale.y = THREE.MathUtils.damp(mesh.current.scale.y, targetScale, 6, delta);
    mesh.current.scale.z = THREE.MathUtils.damp(mesh.current.scale.z, targetScale, 6, delta);
    material.emissiveIntensity = THREE.MathUtils.damp(material.emissiveIntensity, hovered ? 0.12 : 0.06, 6, delta);
  });

  return (
    <group position={position}>
      <mesh
        ref={mesh}
        geometry={geometry}
        material={material}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      />
      <Html center>
        <div className="sr-only">{label}</div>
      </Html>
      {hovered && (
        <Html center>
          <div className="badge-tooltip">
            {label}
          </div>
        </Html>
      )}
      <Html center style={{ pointerEvents: "none" }}>
        <div aria-hidden style={{ width: "24px", height: "24px", borderRadius: "50%", background: "rgba(255,255,255,0.9)", color: "#0b1222", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.3)" }}>
          {getIconAbbrev(label)}
        </div>
      </Html>
    </group>
  );
}

export default function AboutScene({ skills = defaultSkills }) {
  const reducedMotion = usePrefersReducedMotion();
  const mesh = useRef();
  const orbitGroup = useRef();

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(0.6, 1), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: "#cbd5e1", roughness: 0.5, metalness: 0.08, wireframe: true }), []);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame(({ clock }, delta) => {
    if (!mesh.current) return;
    const t = clock.elapsedTime;
    if (reducedMotion) {
      mesh.current.rotation.x = THREE.MathUtils.damp(mesh.current.rotation.x, 0.2, 6, delta);
      mesh.current.rotation.y = THREE.MathUtils.damp(mesh.current.rotation.y, 0.12, 6, delta);
      if (orbitGroup.current) {
        orbitGroup.current.rotation.y = THREE.MathUtils.damp(orbitGroup.current.rotation.y, 0, 4, delta);
        orbitGroup.current.rotation.x = THREE.MathUtils.damp(orbitGroup.current.rotation.x, 0, 4, delta);
      }
      return;
    }
    mesh.current.rotation.x = t * 0.15;
    mesh.current.rotation.y = t * 0.22;
    if (orbitGroup.current) {
      orbitGroup.current.rotation.y = t * 0.18;
      orbitGroup.current.rotation.x = Math.sin(t * 0.2) * 0.06;
    }
  });

  return (
    <group>
      <mesh ref={mesh} geometry={geometry} material={material} position={[0, 0, 0]} />

      <group ref={orbitGroup}>
        {skills.map((s, i) => {
          const pos = s.position ?? ringPosition(i, skills.length);
          return <SkillBadge3D key={s.label} label={s.label} position={pos} color={s.color} />;
        })}
      </group>
    </group>
  );
}

const defaultSkills = [
  { label: "React", position: [1.4, 0.6, 0.4], color: "#61dafb" },
  { label: "Three.js", position: [-1.6, 0.2, -0.3], color: "#88b6ff" },
  { label: "CSS", position: [0.8, -0.9, -0.5], color: "#8fd3ff" },
  { label: "Accessibility", position: [-0.8, -0.6, 0.6], color: "#a7e8ff" },
];

function ringPosition(i, total, radius = 1.6) {
  // Scale radius based on viewport width for responsive mobile layouts
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const scaledRadius = isMobile ? radius * 0.7 : radius;
  const angle = (i / total) * Math.PI * 2;
  const x = Math.cos(angle) * scaledRadius;
  const z = Math.sin(angle) * scaledRadius * 0.7;
  const y = Math.sin(angle * 2) * 0.4;
  return [x, y, z];
}

function getIconAbbrev(label = "") {
  const map = {
    React: "R",
    "Tailwind CSS": "TW",
    WordPress: "WP",
    Netlify: "NL",
    "UI Design": "UI",
    Analytics: "GA",
    SEO: "SEO",
    Python: "Py",
    "Three.js": "3D",
    CSS: "CSS",
    Accessibility: "A11y",
  };
  return map[label] || label.split(" ").map((w) => w[0]).join("").slice(0, 3);
}
