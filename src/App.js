// App.jsx
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, Sky } from "@react-three/drei";
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
        <ambientLight intensity={0.3} />
        <directionalLight
          castShadow
          position={[10, 100, 10]}
          intensity={3}
          shadow-mapSize={[4096, 4096]}
          shadow-camera-far={1000}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />
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
      </Canvas>

      {/* HUD Components fora do Canvas */}
      <ScoreDisplay score={score} />
      <HealthBar health={health} />
      {gameOver && <GameOver score={score} />}
    </>
  );
}
