// Enemy.jsx
import { useRef } from "react";

export default function Enemy({ position = [0, 0.5, 0], onCollision }) {
    const ref = useRef();

    return (
      <mesh ref={ref} position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
}
  