// EnemyManager.jsx
import { useFrame } from "@react-three/fiber";
import { useState, useRef } from "react";
import Enemy from "./enemy.jsx";
import * as THREE from "three";

const SPAWN_INTERVAL = 1000;
const LANES_X = [-2, 0, 2];

export default function EnemyManager({ bullets, onEnemyKilled, onPlayerHit }) {
  const [enemies, setEnemies] = useState([]);
  const lastSpawn = useRef(0);
  const enemyRefs = useRef({});

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
          // Move o inimigo
          enemy.position.z += 0.1;

          // Verifica colisão com o player
          if (enemy.position.z >= 0.5) {
            onPlayerHit?.();
          }

          // Verifica colisão com balas
          for (let i = 0; i < bullets.length; i++) {
            const bullet = bullets[i];
            const bulletPos = new THREE.Vector3(...bullet.position);
            
            // Cria uma caixa de colisão para o inimigo
            const enemyBox = new THREE.Box3().setFromCenterAndSize(
              enemy.position,
              new THREE.Vector3(1, 1, 1)
            );
            
            // Cria uma esfera de colisão para a bala
            const bulletSphere = new THREE.Sphere(bulletPos, 0.3);

            // Verifica se há interseção entre a bala e o inimigo
            if (enemyBox.intersectsSphere(bulletSphere)) {
              bullets.splice(i, 1);
              enemy.hit = true;
              onEnemyKilled?.(enemy.id);
              break;
            }
          }

          return enemy;
        })
        .filter((enemy) => {
          if (enemy.hit) return false;
          if (enemy.position.z > 5) return false;
          return true;
        })
    );
  });

  return (
    <>
      {enemies.map((enemy) => (
        <Enemy
          key={enemy.id}
          position={enemy.position.toArray()}
          ref={(el) => (enemyRefs.current[enemy.id] = el)}
        />
      ))}
    </>
  );
}
