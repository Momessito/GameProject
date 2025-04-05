// Ground.jsx
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import grass from "./assets/grass.jpg"
import road from "./assets/road.jpg"
const TILE_LENGTH = 250;
const NUM_TILES = 3;

export default function Ground() {
  const tiles = useRef([]);
  const leftTiles = useRef([]);
  const rightTiles = useRef([]);

  // Carregue suas texturas localmente
  const roadTexture = useTexture(road);
  const grassTexture = useTexture(grass);

  // Configure a repetição das texturas
  roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  roadTexture.repeat.set(1, 50);
  grassTexture.repeat.set(50, 50);

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
          receiveShadow
        >
          <boxGeometry args={[6, 0.2, TILE_LENGTH]} />
          <meshStandardMaterial map={roadTexture} />
        </mesh>
      ))}

      {/* Caminho da esquerda */}
      {[...Array(NUM_TILES)].map((_, i) => (
        <mesh
          key={`left-${i}`}
          ref={(el) => (leftTiles.current[i] = el)}
          position={[-9, 0, -i * TILE_LENGTH]}
          receiveShadow
        >
          <boxGeometry args={[500, 0.1, TILE_LENGTH]} />
          <meshStandardMaterial map={grassTexture} />
        </mesh>
      ))}

      {/* Caminho da direita */}
      {[...Array(NUM_TILES)].map((_, i) => (
        <mesh
          key={`right-${i}`}
          ref={(el) => (rightTiles.current[i] = el)}
          position={[9, 0, -i * TILE_LENGTH]}
          receiveShadow
        >
          <boxGeometry args={[0, 0.1, TILE_LENGTH]} />
          <meshStandardMaterial map={grassTexture} />
        </mesh>
      ))}
    </>
  );
}
