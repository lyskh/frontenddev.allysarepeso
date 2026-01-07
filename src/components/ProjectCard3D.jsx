import { useRef, useState, useEffect } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ProjectCard3D({ project, position, isActive, onClick, lightFactor = 0, cameraX = 0 }) {
  const mesh = useRef();
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState(null);

  // Debug: log project data
  console.log("ProjectCard3D rendered for:", project.title, "imageUrl:", project.imageUrl);

  // Load texture on mount
  useEffect(() => {
    console.log("useEffect triggered for:", project.title);
    if (!project.imageUrl) {
      console.log("No imageUrl, skipping texture load");
      return;
    }

    console.log("Loading texture from:", project.imageUrl);
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      project.imageUrl,
      (loadedTexture) => {
        // Texture loaded successfully
        console.log("Texture loaded successfully:", project.title);
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        setTexture(loadedTexture);
      },
      (progress) => {
        console.log("Loading progress:", progress);
      },
      (error) => {
        // Texture failed to load - will use fallback color
        console.error(`Failed to load texture for ${project.title}:`, error);
      }
    );
  }, [project.imageUrl, project.title]);

  useFrame((state, delta) => {
    if (!mesh.current) return;

    // Apply texture to material when it loads
    if (texture && mesh.current.material) {
      // Always ensure texture is mapped - Three.js sometimes needs a refresh
      if (mesh.current.material.map !== texture) {
        mesh.current.material.map = texture;
        // Ensure proper UV scaling for the plane
        if (texture.source.data.width && texture.source.data.height) {
          const aspect = texture.source.data.width / texture.source.data.height;
          const planeAspect = 2.5 / 1.6; // plane width / height
          
          // Scale UVs to maintain aspect ratio
          if (aspect > planeAspect) {
            // texture wider than plane - scale U
            texture.repeat.set(planeAspect / aspect, 1);
            texture.offset.set((1 - planeAspect / aspect) / 2, 0);
          } else {
            // texture taller than plane - scale V
            texture.repeat.set(1, aspect / planeAspect);
            texture.offset.set(0, (1 - aspect / planeAspect) / 2);
          }
        }
        mesh.current.material.needsUpdate = true;
        console.log("Applied texture to material:", project.title);
      }
    }

    // Calculate distance from camera center (for depth-of-field effect)
    const distanceFromCenter = Math.abs(position[0] - cameraX);
    const depthFactor = Math.max(0, 1 - distanceFromCenter / 6); // 0..1, fades over 6 units

    // Global mouse parallax: all cards respond subtly to cursor for depth
    const { pointer } = state; // normalized -1..1
    const globalTiltX = pointer.y * -0.02 * depthFactor; // subtle for all cards
    const globalTiltY = pointer.x * 0.02 * depthFactor;
    
    // Enhanced parallax on hover
    const hoverTiltX = hovered ? pointer.y * -0.06 : 0;
    const hoverTiltY = hovered ? pointer.x * 0.08 : 0;
    
    const targetRotX = isActive ? globalTiltX * 0.5 : globalTiltX + hoverTiltX;
    const targetRotY = (hovered ? 0.2 : 0) + globalTiltY + hoverTiltY * 0.25;
    
    mesh.current.rotation.x += (targetRotX - mesh.current.rotation.x) * 0.08;
    mesh.current.rotation.y += (targetRotY - mesh.current.rotation.y) * 0.1;

    // Scale: make active card dominate the stage
    const targetScale = isActive ? 1.65 : hovered ? 1.25 : 1.08;
    mesh.current.scale.x += (targetScale - mesh.current.scale.x) * 0.1;
    mesh.current.scale.y += (targetScale - mesh.current.scale.y) * 0.1;

    // Subtle Y-axis shift on hover
    const baseY = position[1];
    const targetPosY = baseY + (hovered ? 0.06 * pointer.y : 0);
    mesh.current.position.y += (targetPosY - mesh.current.position.y) * 0.06;

    // Depth-of-field: dim and desaturate cards based on distance from camera
    const mat = mesh.current.material;
    if (mat) {
      // Only apply color tint if there's NO texture (fallback gray cards)
      if (!texture) {
        const baseColor = isActive ? 0xf4f4f5 : hovered ? 0xe5e7eb : 0xd1d5db;
        const desaturationFactor = isActive ? 1 : (0.7 + depthFactor * 0.3); // more grey when far
        const dimmedColor = isActive ? baseColor : baseColor - (baseColor * 0.08 * (1 - depthFactor));
        mat.color.setHex(dimmedColor);
      }
      
      // Emissive glow on active
      mat.emissive.setHex(isActive ? 0xffffff : 0x000000);
      mat.emissiveIntensity += ((isActive ? 0.15 : 0) - mat.emissiveIntensity) * 0.08;
      
      // Depth-based opacity falloff
      mat.transparent = true;
      const baseOpacity = isActive ? 1 : hovered ? 0.95 : 0.88;
      const depthOpacity = baseOpacity * (0.4 + depthFactor * 0.6); // fade distant cards
      mat.opacity += (depthOpacity - mat.opacity) * 0.08;
      
      // Surface quality
      mat.roughness = isActive ? 0.35 : 0.6;
      mat.metalness = isActive ? 0.02 : 0.0;
    }

    // Subtle lighting shift from scene progress
    const lightBoost = 0.06 + lightFactor * 0.12; // 0.06..0.18
    if (mat) mat.emissiveIntensity = isActive ? Math.min(0.22, mat.emissiveIntensity + lightBoost * delta * 2) : Math.max(0, mat.emissiveIntensity - 0.02);
  });

  return (
    <mesh
      ref={mesh}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      <planeGeometry args={[2.5, 1.6]} />
      <meshStandardMaterial
        color={texture ? "white" : "#d1d5db"}
        map={texture}
        emissive="#000000"
        emissiveIntensity={0}
        transparent={true}
        opacity={isActive ? 1 : 0.88}
        toneMapped={true}
      />
      <Html center className="sr-only" style={{ pointerEvents: "none" }}>
        {project.title}
      </Html>
    </mesh>
  );
}
