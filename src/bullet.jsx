// Bullet.jsx
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function Bullet({ position, onOutOfBounds }) {
  const ref = useRef();

  useFrame(() => {
    ref.current.position.z -= 0.5;
    if (ref.current.position.z < -50) {
      onOutOfBounds?.();
    }
  });
  

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial color="yellow" />
    </mesh>
  );
}
