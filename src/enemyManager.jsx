// EnemyManager.jsx
import { useFrame } from "@react-three/fiber";
import { useState, useRef } from "react";
import Enemy from "./enemy.jsx";
import * as THREE from "three";

const SPAWN_INTERVAL = 1000;
const LANES_X = [-2, 2];

export default function EnemyManager({ bullets, onEnemyKilled, onPlayerHit }) {
  const [enemies, setEnemies] = useState([]);
  const lastSpawn = useRef(0);

  useFrame(() => {
    const now = performance.now();

    // Spawn de inimigo
    if (now - lastSpawn.current > SPAWN_INTERVAL) {
      const lane = LANES_X[Math.floor(Math.random() * LANES_X.length)];
      const newEnemy = {
        id: Date.now() + Math.random(),
        position: new THREE.Vector3(lane, 0.5, -30),
      };
      setEnemies((prev) => [...prev, newEnemy]);
      lastSpawn.current = now;
    }

    // Atualiza movimento e colisões
    setEnemies((prev) =>
      prev
        .map((enemy) => {
          enemy.position.z += 0.1; // avança até o jogador
          return enemy;
        })
        .filter((enemy) => {
          // Checa se encostou no jogador
          if (enemy.position.z >= 0.5) {
            onPlayerHit?.();
            return false;
          }

          // Checa colisão com bala
          const hit = bullets.some((b) => {
            const bulletPos = new THREE.Vector3(...b.position);
            return bulletPos.distanceTo(enemy.position) < 0.7;
          });
          

          if (hit) {
            onEnemyKilled?.(enemy.id);
            return false;
          }

          return true;
        })
    );
  });

  return (
    <>
      {enemies.map((enemy) => (
        <Enemy key={enemy.id} position={enemy.position.toArray()} />
      ))}
    </>
  );
}
