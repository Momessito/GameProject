// Scene.jsx
import { useState, useRef, useEffect } from "react";
import Player from "./player.jsx";
import Enemy from "./enemy.jsx";
import Ground from "./ground.jsx";

export default function Scene({ onScoreUpdate, onHealthUpdate, onGameOver }) {
  const [enemies, setEnemies] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const lastSpawn = useRef(0);
  const SPAWN_INTERVAL = 1000;
  const LANES_X = [-2, 2]; // Removido o lane do meio (0)

  useEffect(() => {
    if (gameOver) return;

    const spawnEnemy = () => {
      const now = performance.now();
      if (now - lastSpawn.current > SPAWN_INTERVAL) {
        const lane = LANES_X[Math.floor(Math.random() * LANES_X.length)];
        setEnemies(prev => [...prev, {
          id: Date.now(),
          position: [lane, 0.5, -30]
        }]);
        lastSpawn.current = now;
      }
    };

    const interval = setInterval(spawnEnemy, 1000);
    return () => clearInterval(interval);
  }, [gameOver]);

  const handlePlayerUpdate = (data) => {
    if (data.bullets) {
      setBullets(data.bullets);
    }
  };

  const handlePlayerHit = () => {
    setHealth(prev => {
      const newHealth = prev - 20;
      onHealthUpdate?.(newHealth);
      if (newHealth <= 0) {
        setGameOver(true);
        onGameOver?.();
      }
      return newHealth;
    });
  };

  const removeEnemy = (enemyId, wasKilled = false) => {
    setEnemies(prev => prev.filter(enemy => enemy.id !== enemyId));
    if (wasKilled) {
      const newScore = score + 100;
      setScore(newScore);
      onScoreUpdate?.(newScore);
    }
  };

  return (
    <>
      <Player onUpdate={handlePlayerUpdate} />
      <Ground />
      
      {enemies.map((enemy) => (
        <Enemy
          key={enemy.id}
          position={enemy.position}
          bullets={bullets}
          onEnemyKilled={() => removeEnemy(enemy.id, true)}
          onCollision={() => {
            removeEnemy(enemy.id, false);
            handlePlayerHit();
          }}
        />
      ))}
    </>
  );
}
