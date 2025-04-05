export default function Background() {
  return (
    <>
    <mesh position={[0, 0, -100]} rotation={[0, 0, 0]}>
      <planeGeometry args={[1000, 100]} />
      <meshStandardMaterial color="#60B5FF" />
    </mesh>
    <mesh position={[0, 0, -99]} rotation={[0, 0, 0]}>
  <circleGeometry args={[10, 64, 64]} />
  <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={5} />
</mesh>


    </>
  );
} 