// Ground.jsx
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const TILE_LENGTH = 250;
const NUM_TILES = 3;

export default function Ground() {
  const tiles = useRef([]);

  useFrame((state) => {
    tiles.current.forEach((tile, index) => {
      tile.position.z += 0.1; // move para trás

      // Quando um tile sair da visão, reposiciona ele pra frente
      if (tile.position.z > TILE_LENGTH) {
        tile.position.z -= TILE_LENGTH * NUM_TILES;
      }
    });
  });

  return (
    <>
      {[...Array(NUM_TILES)].map((_, i) => (
        <mesh
          key={i}
          ref={(el) => (tiles.current[i] = el)}
          position={[0, 0, -i * TILE_LENGTH]}
        >
          <boxGeometry args={[6, 0.1, TILE_LENGTH]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      ))}
    </>
  );
}
