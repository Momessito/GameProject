import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function DangerIndicator({ lane, warningTime }) {
  const ref = useRef();
  const startTime = useRef(Date.now());

  useFrame(() => {
    if (!ref.current) return;

    const elapsed = Date.now() - startTime.current;
    const progress = elapsed / warningTime;
    
    // Pisca mais rápido conforme o tempo passa
    const blinkSpeed = 5 + (progress * 10);
    const opacity = ((Math.sin(elapsed * 0.01 * blinkSpeed) + 1) / 2) * (1 - progress);

    ref.current.material.opacity = opacity;
  });

  return (
    <mesh
      ref={ref}
      position={[lane * 2, 0.1, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[1.8, 30]} />
      <meshBasicMaterial
        color="#ff0000"
        transparent
        opacity={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
} 