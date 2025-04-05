// App.jsx
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, Sky, SpotLight } from "@react-three/drei";
import Scene from "./scene.jsx";
import { useState } from "react";
import ScoreDisplay from "./ScoreDisplay.jsx";
import HealthBar from "./HealthBar.jsx";
import GameOver from "./GameOver.jsx";

export default function App() {
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [gameOver, setGameOver] = useState(false);

  const handleScoreUpdate = (newScore) => {
    setScore(newScore);
  };

  const handleHealthUpdate = (newHealth) => {
    setHealth(newHealth);
  };

  const handleGameOver = () => {
    setGameOver(true);
  };

  return (
    <>
      <Canvas shadows style={{ width: "100vw", height: "100vh" }}>
        <Sky sunPosition={[100, 20, 100]} />
        <PerspectiveCamera makeDefault position={[0, 5, 10]} />
        
        {/* Iluminação ambiente suave */}
        <ambientLight intensity={0.3} />

        {/* Luz principal direcional (sol) */}
        <directionalLight
          castShadow
          position={[10, 20, 10]}
          intensity={1.5}
          shadow-mapSize={[4096, 4096]}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />

        {/* Luz de preenchimento frontal */}
        <spotLight
          position={[0, 10, 0]}
          angle={0.5}
          penumbra={1}
          intensity={0.5}
          castShadow={false}
        />

        {/* Luz de realce traseira */}
        <pointLight
          position={[0, 10, -10]}
          intensity={0.3}
          color="#ffffff"
        />

        {/* Luz do chão para melhorar visibilidade */}
        <hemisphereLight
          intensity={0.4}
          color="#ffffff"
          groundColor="#444444"
        />

        <Scene 
          onScoreUpdate={handleScoreUpdate}
          onHealthUpdate={handleHealthUpdate}
          onGameOver={handleGameOver}
        />

        {/* Luzes de destaque para o player */}
        <spotLight
          position={[0, 5, 2]}
          angle={0.4}
          penumbra={0.5}
          intensity={0.5}
          castShadow
          color="#ffffff"
        />

      </Canvas>

      {/* HUD Components fora do Canvas */}
      <ScoreDisplay score={score} />
      <HealthBar health={health} />
      {gameOver && <GameOver score={score} />}
    </>
  );
}
