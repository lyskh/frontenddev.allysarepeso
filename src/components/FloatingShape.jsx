import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function FloatingShape({ position = [-2.4, 0.25, 0], scale = 0.9 }) {
  const mesh = useRef();

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = clock.elapsedTime * 0.2;
    mesh.current.position.y = (position?.[1] ?? 0.25) + Math.sin(clock.elapsedTime) * 0.2;
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color="#d4d4d8" wireframe />
    </mesh>
  );
}
