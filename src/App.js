// App.jsx
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import Scene from "./scene.jsx";

export default function App() {
  return (
    <Canvas style={{ width: "100vw", height: "100vh" }}>
      <PerspectiveCamera makeDefault position={[0, 5, 10]} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Scene />
    </Canvas>
  );
}
