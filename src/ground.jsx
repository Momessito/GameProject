// Ground.jsx
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const TILE_LENGTH = 250;
const NUM_TILES = 3;

export default function Ground() {
  const tiles = useRef([]);
  const leftTiles = useRef([]);
  const rightTiles = useRef([]);

  useFrame((state) => {
    // Atualiza tiles centrais
    tiles.current.forEach((tile, index) => {
      tile.position.z += 0.1;
      if (tile.position.z > TILE_LENGTH) {
        tile.position.z -= TILE_LENGTH * NUM_TILES;
      }
    });

    // Atualiza tiles laterais
    leftTiles.current.forEach((tile, index) => {
      tile.position.z += 0.1;
      if (tile.position.z > TILE_LENGTH) {
        tile.position.z -= TILE_LENGTH * NUM_TILES;
      }
    });

    rightTiles.current.forEach((tile, index) => {
      tile.position.z += 0.1;
      if (tile.position.z > TILE_LENGTH) {
        tile.position.z -= TILE_LENGTH * NUM_TILES;
      }
    });
  });

  return (
    <>

      {/* Caminho central */}
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

      {/* Caminho da esquerda */}
      {[...Array(NUM_TILES)].map((_, i) => (
        <mesh
          key={`left-${i}`}
          ref={(el) => (leftTiles.current[i] = el)}
          position={[-9, 0, -i * TILE_LENGTH]}
        >
          <boxGeometry args={[500, -0.1, TILE_LENGTH]} />
          <meshStandardMaterial color="green" />
        </mesh>
      ))}

      {/* Caminho da direita */}
      {[...Array(NUM_TILES)].map((_, i) => (
        <mesh
          key={`right-${i}`}
          ref={(el) => (rightTiles.current[i] = el)}
          position={[9, 0, -i * TILE_LENGTH]}
        >
          <meshStandardMaterial color="darkgray" />
        </mesh>
      ))}
    </>
  );
}
