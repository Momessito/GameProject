export default function Background() {
  return (
    <mesh position={[0, 0, -100]} rotation={[0, 0, 0]}>
      <planeGeometry args={[1000, 100]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
} 