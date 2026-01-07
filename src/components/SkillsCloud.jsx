import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

const skillsData = [
  // WEB DEVELOPMENT
  { label: "HTML", category: "Web Dev", color: "#e34c26" },
  { label: "CSS", category: "Web Dev", color: "#563d7c" },
  { label: "JS", category: "Web Dev", color: "#f7df1e" },
  { label: "React", category: "Web Dev", color: "#61dafb" },
  { label: "Tailwind", category: "Web Dev", color: "#38bdf8" },

  // CMS & DEPLOYMENT
  { label: "WordPress", category: "CMS", color: "#21759b" },
  { label: "Netlify", category: "Deploy", color: "#00ad9f" },
  { label: "Hugo", category: "Deploy", color: "#ff4088" },
  { label: "GitHub", category: "Deploy", color: "#333333" },

  // DESIGN & UI
  { label: "Canva", category: "Design", color: "#00d4ff" },
  { label: "Framer", category: "Design", color: "#0055ff" },
  { label: "Layout & Interaction", category: "Design", color: "#a78bfa" },

  // ANALYTICS & SEO
  { label: "Google Analytics", category: "Analytics", color: "#e37400" },
  { label: "SEO Fundamentals", category: "SEO", color: "#7dd3fc" },

  // TECHNICAL SKILLS
  { label: "Python", category: "Technical", color: "#3776ab" },
  { label: "APIs", category: "Technical", color: "#ff6c37" },
  { label: "Troubleshooting", category: "Technical", color: "#9d4edd" },
  { label: "L1 Support", category: "Technical", color: "#06ffa5" },

  // PRODUCTIVITY & CRM
  { label: "Notion", category: "Productivity", color: "#000000" },
  { label: "Google Workspace", category: "Productivity", color: "#4285f4" },
  { label: "HubSpot", category: "Productivity", color: "#ff7a59" },
  { label: "Meta Business Suite", category: "Productivity", color: "#1877f2" },
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduce-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reduced;
}

function SkillBadge({ label, category, position = [0, 0, 0], color = "#61dafb" }) {
  const mesh = useRef();
  const [hovered, setHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const geometry = useMemo(() => new THREE.SphereGeometry(0.12, 16, 16), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.4,
        metalness: 0.1,
        emissive: color,
        emissiveIntensity: 0.2,
      }),
    [color]
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    const targetScale = hovered ? 1.3 : 1;
    mesh.current.scale.x = THREE.MathUtils.damp(mesh.current.scale.x, targetScale, 8, delta);
    mesh.current.scale.y = THREE.MathUtils.damp(mesh.current.scale.y, targetScale, 8, delta);
    mesh.current.scale.z = THREE.MathUtils.damp(mesh.current.scale.z, targetScale, 8, delta);
    material.emissiveIntensity = THREE.MathUtils.damp(material.emissiveIntensity, hovered ? 0.5 : 0.2, 8, delta);
  });

  return (
    <group position={position}>
      <mesh
        ref={mesh}
        geometry={geometry}
        material={material}
        onPointerOver={() => {
          setHovered(true);
          setShowTooltip(true);
        }}
        onPointerOut={() => {
          setHovered(false);
          setShowTooltip(false);
        }}
      />

      <Html center>
        <div className="sr-only">{label} - {category}</div>
      </Html>

      {showTooltip && (
        <Html center position={[0, 0.25, 0]}>
          <div
            style={{
              padding: "6px 10px",
              borderRadius: "6px",
              background: "rgba(12, 16, 30, 0.9)",
              border: "1px solid rgba(128, 255, 234, 0.3)",
              color: "#e6ebff",
              fontSize: "11px",
              fontWeight: 500,
              pointerEvents: "none",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div>{label}</div>
            <div style={{ color: "rgba(159, 176, 215, 0.8)", fontSize: "10px", marginTop: "2px" }}>
              {category}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function CentralObject({ reducedMotion }) {
  const mesh = useRef();

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(0.5, 2), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#cbd5e1",
        roughness: 0.5,
        metalness: 0.1,
        emissive: "#5dd8ff",
        emissiveIntensity: 0.15,
        wireframe: true,
      }),
    []
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame(({ clock }, delta) => {
    if (!mesh.current) return;
    const t = clock.elapsedTime;

    if (reducedMotion) {
      mesh.current.rotation.x = THREE.MathUtils.damp(mesh.current.rotation.x, 0.1, 4, delta);
      mesh.current.rotation.y = THREE.MathUtils.damp(mesh.current.rotation.y, 0.1, 4, delta);
      return;
    }

    mesh.current.rotation.x = t * 0.1;
    mesh.current.rotation.y = t * 0.15;
  });

  return <mesh ref={mesh} geometry={geometry} material={material} />;
}

function FloatingBadges({ reducedMotion }) {
  const orbitGroup = useRef();

  useFrame(({ clock }, delta) => {
    if (!orbitGroup.current) return;
    const t = clock.elapsedTime;

    if (reducedMotion) {
      orbitGroup.current.rotation.y = THREE.MathUtils.damp(orbitGroup.current.rotation.y, 0, 4, delta);
      orbitGroup.current.rotation.x = THREE.MathUtils.damp(orbitGroup.current.rotation.x, 0, 4, delta);
      return;
    }

    orbitGroup.current.rotation.y = t * 0.12;
    orbitGroup.current.rotation.x = Math.sin(t * 0.1) * 0.15;
  });

  return (
    <group ref={orbitGroup}>
      {skillsData.map((skill, i) => {
        const angle = (i / skillsData.length) * Math.PI * 2;
        const radius = 2.2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(angle * 1.5) * 0.8;

        return (
          <SkillBadge
            key={skill.label}
            label={skill.label}
            category={skill.category}
            position={[x, y, z]}
            color={skill.color}
          />
        );
      })}
    </group>
  );
}

function FloatingAccent({ reducedMotion }) {
  const mesh = useRef();

  const geometry = useMemo(() => new THREE.TorusKnotGeometry(0.35, 0.08, 96, 16), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#80ffea",
        roughness: 0.25,
        metalness: 0.35,
        emissive: "#5dd8ff",
        emissiveIntensity: 0.35,
      }),
    []
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame(({ clock }, delta) => {
    if (!mesh.current) return;
    const t = clock.elapsedTime;

    const targetY = reducedMotion ? 1.1 : Math.sin(t * 0.8) * 0.35 + 1.1;
    const targetX = reducedMotion ? 0 : Math.cos(t * 0.4) * 0.4;
    const targetZ = reducedMotion ? -0.4 : Math.sin(t * 0.35) * 0.4 - 0.4;

    mesh.current.position.y = THREE.MathUtils.damp(mesh.current.position.y, targetY, 4, delta);
    mesh.current.position.x = THREE.MathUtils.damp(mesh.current.position.x, targetX, 4, delta);
    mesh.current.position.z = THREE.MathUtils.damp(mesh.current.position.z, targetZ, 4, delta);

    if (reducedMotion) {
      mesh.current.rotation.x = THREE.MathUtils.damp(mesh.current.rotation.x, 0.2, 4, delta);
      mesh.current.rotation.y = THREE.MathUtils.damp(mesh.current.rotation.y, 0.3, 4, delta);
      return;
    }

    mesh.current.rotation.x += delta * 0.6;
    mesh.current.rotation.y += delta * 0.75;
  });

  return <mesh ref={mesh} geometry={geometry} material={material} />;
}

export default function SkillsCloud() {
  const reducedMotion = usePrefersReducedMotion();
  const { camera } = useThree();

  // Auto-rotate camera slightly for visual interest
  useFrame(({ clock }, delta) => {
    if (reducedMotion) return;
    const t = clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.15) * 0.3;
  });

  return (
    <>
      {/* Lighting setup */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 4]} intensity={0.8} />
      <pointLight position={[-5, -5, 5]} intensity={0.3} color="#5dd8ff" />

      {/* Central object */}
      <CentralObject reducedMotion={reducedMotion} />

      {/* Floating accent model */}
      <FloatingAccent reducedMotion={reducedMotion} />

      {/* Floating badges */}
      <FloatingBadges reducedMotion={reducedMotion} />
    </>
  );
}
