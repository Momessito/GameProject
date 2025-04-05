// Scene.jsx
import { useState } from "react";
import Ground from "./ground";
import Player from "./player";
import EnemyManager from "./enemyManager";
import Background from "./background";
import { Html } from "@react-three/drei";

export default function Scene() {
  const [bullets, setBullets] = useState([]);
  const [score, setScore] = useState(0);

  const handlePlayerUpdate = (data) => {
    setBullets(data.bullets);
  };

  const handleEnemyKilled = () => {
    setScore(prev => prev + 100);
  };

  const handlePlayerHit = () => {
    setScore(0); // Reinicia a pontuação quando o jogador é atingido
  };

  return (
    <>
      <Background />
      <Ground />
      <Player onUpdate={handlePlayerUpdate} />
      <EnemyManager 
        bullets={bullets} 
        onEnemyKilled={handleEnemyKilled}
        onPlayerHit={handlePlayerHit}
      />
      
      <Html position={[0, 4, 0]} center>
        <div style={{
          color: 'white',
          padding: '10px',
          background: 'rgba(0,0,0,0.7)',
          borderRadius: '5px',
          fontSize: '24px'
        }}>
          Pontuação: {score}
        </div>
      </Html>
    </>
  );
}
