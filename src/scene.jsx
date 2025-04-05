// Scene.jsx
import { useState, useRef } from "react";
import Player from "./player";
import EnemyManager from "./enemyManager";
import Ground from "./ground";

export default function Scene() {
  const [bullets, setBullets] = useState([]);
  const [life, setLife] = useState(3);

  const handlePlayerUpdate = ({ bullets }) => {
    setBullets(bullets);
  };

  const handleEnemyKilled = (id) => {
    console.log("💥 Inimigo destruído:", id);
  };

  const handlePlayerHit = () => {
    setLife((prev) => {
      const next = prev - 1;
      console.log("💔 Jogador atingido! Vida restante:", next);
      return next;
    });
  };

  return (
    <>
      <ambientLight />
      <directionalLight position={[5, 10, 5]} />
      <Player onUpdate={handlePlayerUpdate} />
      <EnemyManager
        bullets={bullets}
        onEnemyKilled={handleEnemyKilled}
        onPlayerHit={handlePlayerHit}
      />
      <Ground />
    </>
  );
}
