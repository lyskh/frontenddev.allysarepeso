import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import * as THREE from "three";

const LOADER_DURATION = 2500; // 2.5 seconds
const STAR_COUNT = 80;

// Optimized Twinkling Octahedron Stars Component
function TwinklingStarsScene() {
  const groupRef = useRef();
  const starsRef = useRef([]);

  // Create octahedron stars
  useMemo(() => {
    if (!groupRef.current) return;

    // Clear existing stars
    groupRef.current.children.forEach((child) => {
      child.geometry?.dispose();
      child.material?.dispose();
    });
    groupRef.current.clear();
    starsRef.current = [];

    // Create octahedron geometry (shared to save memory)
    const octaGeometry = new THREE.OctahedronGeometry(0.08, 0);

    for (let i = 0; i < STAR_COUNT; i++) {
      const material = new THREE.MeshStandardMaterial({
        color: 0x80ffea,
        emissive: 0x5dd8ff,
        emissiveIntensity: 0.4,
        metalness: 0.8,
        roughness: 0.2,
        wireframe: false,
      });

      const mesh = new THREE.Mesh(octaGeometry, material);

      // Random positions
      mesh.position.set(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2
      );

      // Random initial rotation
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      groupRef.current.add(mesh);
      starsRef.current.push({
        mesh,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        speedZ: (Math.random() - 0.5) * 0.5,
        scalePhase: Math.random() * Math.PI * 2,
      });
    }
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    starsRef.current.forEach((star, i) => {
      // Rotation
      star.mesh.rotation.x += star.speedX * 0.02;
      star.mesh.rotation.y += star.speedY * 0.02;
      star.mesh.rotation.z += star.speedZ * 0.02;

      // Twinkling scale
      const scale =
        0.7 + Math.sin(state.clock.elapsedTime * 2 + i * 0.2) * 0.3;
      star.mesh.scale.set(scale, scale, scale);

      // Pulsing emissive
      const emissive =
        0.3 + Math.sin(state.clock.elapsedTime * 1.5 + star.scalePhase) * 0.4;
      star.mesh.material.emissiveIntensity = emissive;
    });
  });

  return <group ref={groupRef} />;
}

export default function CinematicLoader({ onLoadComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const loaderTimeoutRef = useRef(null);
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    // Smooth, non-abrupt progress increments
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const target = 95; // glide up to 95% until final completion
        const step = Math.max(0.5, (target - prev) * 0.06); // ease-in-out feel
        return Math.min(prev + step, target);
      });
    }, 50);

    // Complete loader after duration with smooth progress finish
    loaderTimeoutRef.current = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsVisible(false);
        onLoadComplete?.();
      }, 500); // brief pause so 100% is visible
    }, LOADER_DURATION);

    return () => {
      clearInterval(progressIntervalRef.current);
      clearTimeout(loaderTimeoutRef.current);
    };
  }, [onLoadComplete]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="cinematic-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="cinematic-loader-wrapper"
        >
          {/* Three.js Canvas - Twinkling Octahedron Stars Background */}
          <div className="cinematic-loader-canvas">
            <Canvas
              camera={{ position: [0, 0, 2], fov: 60 }}
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: "high-performance",
              }}
              dpr={
                typeof window !== "undefined"
                  ? Math.min(window.devicePixelRatio, 2)
                  : 1
              }
              style={{ width: "100%", height: "100%" }}
            >
              <color attach="background" args={["#060910"]} />
              <ambientLight intensity={0.5} />
              <TwinklingStarsScene />
              <Preload all />
            </Canvas>
          </div>

          {/* Loader Content Overlay */}
          <div className="cinematic-loader-content">
            {/* Animated Name */}
            <motion.div
              className="cinematic-loader-name"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.7,
                delay: 0.25,
                ease: "easeOut",
              }}
            >
              <div className="cinematic-loader-name-text">
                {"ALLYSA".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    className="cinematic-loader-char"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.35 + i * 0.075,
                      ease: [0.34, 1.56, 0.64, 1], // cubic-bezier for bounce
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              className="cinematic-loader-subtitle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.05, ease: "easeOut" }}
            >
              Front End Developer
            </motion.p>

            {/* Progress Bar */}
            <motion.div
              className="cinematic-loader-progress-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="cinematic-loader-progress-bar">
                <motion.div
                  className="cinematic-loader-progress-fill"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
              </div>
              <motion.span
                className="cinematic-loader-progress-text"
                animate={{ opacity: progress === 100 ? 0 : 1 }}
        transition={{ duration: 0.4 }}
              >
                {Math.round(progress)}%
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
