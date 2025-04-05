// Bullet.jsx
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function Bullet({ position, onOutOfBounds, onMove }) {
  const ref = useRef();

  useFrame(() => {
    ref.current.position.z -= 0.5;
    
    // Atualiza a posição real da bala
    onMove?.([
      ref.current.position.x,
      ref.current.position.y,
      ref.current.position.z
    ]);

    if (ref.current.position.z < -50) {
      onOutOfBounds?.();
    }
  });
  

  return (
    <mesh ref={ref} position={position} castShadow>
      <sphereGeometry args={[0.3, 5, 5]} />
      <meshStandardMaterial 
        color="yellow"
        metalness={0.7}
        roughness={0.3}
        emissive="orange"
        emissiveIntensity={2}
      />
    </mesh>
  );
}
