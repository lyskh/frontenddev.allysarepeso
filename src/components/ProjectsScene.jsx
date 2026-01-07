import { useRef, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import ProjectCard3D from "../components/ProjectCard3D";

// Constants for readability and performance tuning
const CARD_SPACING = 3.6; // horizontal spacing between cards (tighter to fill space)
const SCROLL_SPEED = 0.003; // wheel delta multiplier
const SCROLL_SMOOTHING = 0.08; // interpolation for scroll
const CAMERA_SMOOTHING = 0.06; // camera interpolation
const ZOOM_ACTIVE = 3.2; // fixed per requirements
const ZOOM_INACTIVE = 4.0;
const TARGET_Y = -0.4; // consistent Y
const LOOK_AT_Y = -0.3; // lookAt Y to center cards
const LIGHT_SMOOTHING = 0.06;
const LIGHT_DELTA_THRESHOLD = 0.01; // thresholded lighting updates
const VELOCITY_DECAY = 0.92; // momentum decay
const SNAP_THRESHOLD = 0.02; // snap when velocity small

export default function ProjectsScene({ projects, activeId, setActiveId }) {
  const { camera } = useThree();
  const scrollRef = useRef(0); // current interpolated scroll X
  const targetRef = useRef(0); // target X (snap destination)
  const velocityRef = useRef(0); // momentum velocity
  const isInteractingRef = useRef(false);
  const lightFactorRef = useRef(0);
  const spotLightRef = useRef();
  const ambientRef = useRef();
  const touchStartXRef = useRef(null);

  // Memoized event handlers
  const handleWheel = useCallback((e) => {
    const delta = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 60);
    velocityRef.current += delta * SCROLL_SPEED;
    isInteractingRef.current = true;
  }, []);

  const handleKey = useCallback((e) => {
    const maxX = (projects.length - 1) * CARD_SPACING;
    if (e.key === "ArrowRight") {
      const next = Math.min(targetRef.current + CARD_SPACING, maxX);
      targetRef.current = next;
      const idx = Math.round(next / CARD_SPACING);
      const proj = projects[idx];
      if (proj) setActiveId(proj.id);
      return;
    }
    if (e.key === "ArrowLeft") {
      const next = Math.max(targetRef.current - CARD_SPACING, 0);
      targetRef.current = next;
      const idx = Math.round(next / CARD_SPACING);
      const proj = projects[idx];
      if (proj) setActiveId(proj.id);
      return;
    }
    if (e.key === "Home") {
      targetRef.current = 0;
      const proj = projects[0];
      if (proj) setActiveId(proj.id);
      return;
    }
    if (e.key === "End") {
      const maxTarget = (projects.length - 1) * CARD_SPACING;
      targetRef.current = maxTarget;
      const proj = projects[projects.length - 1];
      if (proj) setActiveId(proj.id);
      return;
    }
  }, [projects, setActiveId]);

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
    isInteractingRef.current = true;
  }, []);

  const handleTouchMove = useCallback((e) => {
    const touch = e.touches[0];
    if (touchStartXRef.current == null) return;
    const dx = touch.clientX - touchStartXRef.current;
    const delta = -dx; // swipe left moves right
    velocityRef.current += delta * 0.01; // per requirements
  }, []);

  // Attach listeners with passive options
  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKey);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleWheel, handleKey, handleTouchStart, handleTouchMove]);

  // Sync camera target when selection changes (e.g., click or URL state)
  useEffect(() => {
    if (activeId == null) return;
    const idx = projects.findIndex((p) => p.id === activeId);
    if (idx >= 0) targetRef.current = idx * CARD_SPACING;
  }, [activeId, projects]);

  useFrame(() => {
    const maxX = (projects.length - 1) * CARD_SPACING || 1;

    // Momentum integration & decay
    if (Math.abs(velocityRef.current) > 0) {
      targetRef.current += velocityRef.current;
      velocityRef.current *= VELOCITY_DECAY;
      isInteractingRef.current = true;
    } else {
      isInteractingRef.current = false;
    }

    // Clamp within bounds
    targetRef.current = Math.max(0, Math.min(targetRef.current, maxX));

    // Smooth scroll interpolation
    scrollRef.current += (targetRef.current - scrollRef.current) * SCROLL_SMOOTHING;
    camera.position.x = scrollRef.current;

    // Snap to nearest card when movement settles
    if (!isInteractingRef.current && Math.abs(velocityRef.current) < SNAP_THRESHOLD) {
      const nearestIdx = Math.round(targetRef.current / CARD_SPACING);
      targetRef.current = nearestIdx * CARD_SPACING;
    }

    // Camera positioning & zoom (clipping fix)
    const targetZ = activeId !== null ? ZOOM_ACTIVE : ZOOM_INACTIVE;
    const targetY = TARGET_Y;
    camera.position.z += (targetZ - camera.position.z) * CAMERA_SMOOTHING;
    camera.position.y += (targetY - camera.position.y) * CAMERA_SMOOTHING;

    camera.lookAt(camera.position.x, LOOK_AT_Y, 0);

    // Lighting factor based on scroll progress (0..1)
    const progress = Math.min(1, Math.max(0, scrollRef.current / maxX));
    const nextLightFactor = lightFactorRef.current + (progress - lightFactorRef.current) * LIGHT_SMOOTHING;
    if (Math.abs(nextLightFactor - lightFactorRef.current) > LIGHT_DELTA_THRESHOLD) {
      lightFactorRef.current = nextLightFactor;
    }
    
    // Dynamic spotlight follows camera (thresholded)
    if (spotLightRef.current) {
      const targetX = camera.position.x;
      spotLightRef.current.position.x += (targetX - spotLightRef.current.position.x) * 0.1;
      const desiredIntensity = activeId !== null ? 1.2 : 0.8;
      const nextIntensity = spotLightRef.current.intensity + (desiredIntensity - spotLightRef.current.intensity) * LIGHT_SMOOTHING;
      if (Math.abs(nextIntensity - spotLightRef.current.intensity) > LIGHT_DELTA_THRESHOLD) {
        spotLightRef.current.intensity = nextIntensity;
      }
    }
    
    // Ambient light shifts with scroll progress (thresholded)
    if (ambientRef.current) {
      const desiredAmbient = 0.5 + progress * 0.2; // 0.5..0.7
      const nextAmbient = ambientRef.current.intensity + (desiredAmbient - ambientRef.current.intensity) * (LIGHT_SMOOTHING * 0.66);
      if (Math.abs(nextAmbient - ambientRef.current.intensity) > LIGHT_DELTA_THRESHOLD) {
        ambientRef.current.intensity = nextAmbient;
      }
    }
  });

  return (
    <>
      {/* Optional depth fog for subtle sense of distance */}
      <fog attach="fog" args={["#1a1a2e", 8, 20]} />

      <ambientLight ref={ambientRef} intensity={0.5} />
      <spotLight
        ref={spotLightRef}
        position={[0, 3, 2]}
        angle={0.6}
        penumbra={0.8}
        intensity={0.8}
        castShadow={false}
        color="#ffffff"
      />
      <pointLight position={[10, 2, 2]} intensity={0.3} color="#a5b4fc" />
      <pointLight position={[-10, 2, 2]} intensity={0.3} color="#fbbf24" />
      
      {projects.map((project, index) => (
        <ProjectCard3D
          key={project.id}
          project={project}
          position={[index * CARD_SPACING, -0.4, 0]}
          isActive={activeId === project.id}
          onClick={() => setActiveId(activeId === project.id ? null : project.id)}
          lightFactor={lightFactorRef.current}
          cameraX={camera.position.x}
        />
      ))}

      {/* Scroll indicators (HUD) */}
      <Html center style={{ pointerEvents: "none" }}>
        <div style={{ position: "absolute", bottom: 18, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 }}>
          {projects.map((p, i) => {
            const progressIdx = Math.round(scrollRef.current / CARD_SPACING);
            const active = progressIdx === i;
            return (
              <span key={p.id} style={{ width: 8, height: 8, borderRadius: 999, background: active ? "#ffffff" : "#64748b", opacity: active ? 0.95 : 0.6 }} />
            );
          })}
        </div>
      </Html>
    </>
  );
}
