// Enemy.jsx
export default function Enemy({ position = [0, 0.5, 0] }) {
    return (
      <mesh position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }
  