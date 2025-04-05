// App.jsx
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, Sky } from "@react-three/drei";
import Scene from "./scene.jsx";
import { useState } from "react";
import "./styles/hud.css";
import ScoreDisplay from "./ScoreDisplay.jsx";
import HealthBar from "./HealthBar.jsx";
import PowerUp from "./powerUp.jsx";
import ComboDisplay from "./components/ComboDisplay.jsx";
import PowerUpIndicator from "./components/PowerUpIndicator.jsx";
import GameOver from "./GameOver.jsx";

export default function App() {
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [combo, setCombo] = useState(0);
  const [currentPowerUp, setCurrentPowerUp] = useState(null);
  const [playerLane, setPlayerLane] = useState(0);

  const handleRestart = () => {
    setScore(0);
    setHealth(100);
    setGameOver(false);
    setCombo(0);
    setCurrentPowerUp(null);
    setPlayerLane(0);
    // Outros resets necessários
  };

  return (
    <div className="game-container">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 5, 10]} />
        <Sky sunPosition={[100, 20, 100]} />
        
        {/* Iluminação ambiente suave */}
        <ambientLight intensity={0.1} />

        {/* Luz principal direcional (sol) */}
        <directionalLight
          castShadow
          position={[10, 20, 10]}
          intensity={0}
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
          onScoreUpdate={setScore}
          onHealthUpdate={setHealth}
          onGameOver={() => setGameOver(true)}
          onComboUpdate={setCombo}
          onPowerUpChange={setCurrentPowerUp}
          playerLane={playerLane}
          onPlayerLaneChange={setPlayerLane}
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

      {/* HUD Container */}
      <div className="hud-container">
        <ScoreDisplay score={score} />
        <HealthBar health={health} />
        {combo > 0 && <ComboDisplay combo={combo} />}
        {currentPowerUp && <PowerUpIndicator type={currentPowerUp} />}
        {gameOver && <GameOver score={score} onRestart={handleRestart} />}
      </div>
    </div>
  );
}
