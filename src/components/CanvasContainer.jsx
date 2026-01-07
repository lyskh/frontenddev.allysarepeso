import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import Loader from "./Loader";

export default function CanvasContainer({
  children,
  camera = { position: [0, 0, 5], fov: 50 },
  enableOrbit = true,
  className,
  style,
}) {
  return (
    <Canvas camera={camera} dpr={[1, 2]} className={className} style={style}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} />
      <Suspense fallback={<Loader />}>
        {children}
      </Suspense>
      {enableOrbit ? <OrbitControls enableZoom={false} /> : null}
    </Canvas>
  );
}
