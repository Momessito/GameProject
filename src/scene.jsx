// Scene.jsx
import { useState, useRef, useEffect } from "react";
import Player from "./player.jsx";
import Enemy from "./enemy.jsx";
import Ground from "./ground.jsx";
import PowerUp from "./powerUp.jsx";
import DangerIndicator from "./components/DangerIndicator.jsx";
import KillStreakDisplay from "./components/KillStreakDisplay.jsx";
import { MobileControls } from './components/MobileControls.jsx';
import Background from './background.jsx';

export default function Scene({ 
  onScoreUpdate, 
  onHealthUpdate, 
  onGameOver, 
  onComboUpdate, 
  onPowerUpChange,
  playerLane,
  onPlayerLaneChange
}) {
  const [enemies, setEnemies] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [combo, setCombo] = useState(0);
  const [powerUps, setPowerUps] = useState([]);
  const [currentPowerUp, setCurrentPowerUp] = useState(null);
  const lastSpawn = useRef(0);
  const lastPowerUpSpawn = useRef(0);
  const gameStartTime = useRef(Date.now());
  const killStreak = useRef(0);
  const multiplier = useRef(1);
  const lastKillTime = useRef(0);
  const INITIAL_SPAWN_INTERVAL = 800;
  const POWER_UP_SPAWN_INTERVAL = 15000; // 15 segundos
  const LANES_X = [-2, 0, 2];
  const [lastMoveTime, setLastMoveTime] = useState(Date.now());
  const [dangerLanes, setDangerLanes] = useState([]); // Lanes que vão receber ataque
  const [warningTimer, setWarningTimer] = useState(null);
  const DANGER_INTERVAL = 3000; // 3 segundos parado = perigo
  const WARNING_TIME = 1500; // 1.5 segundos de aviso
  const KILL_STREAK_TIMEOUT = 2000; // 2 segundos para manter o streak

  // Sistema de Combos
  useEffect(() => {
    if (combo > 0) {
      const comboTimer = setTimeout(() => setCombo(0), 2000); // Reset combo após 2 segundos sem matar
      return () => clearTimeout(comboTimer);
    }
  }, [combo]);

  // Sistema de Power-ups
  useEffect(() => {
    if (gameOver) return;

    const spawnPowerUp = () => {
      const now = Date.now();
      if (now - lastPowerUpSpawn.current > POWER_UP_SPAWN_INTERVAL) {
        const lane = LANES_X[Math.floor(Math.random() * LANES_X.length)];
        const powerUpTypes = ['doublePoints', 'shield', 'rapidFire', 'multiShot'];
        const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        
        setPowerUps(prev => [...prev, {
          id: Date.now(),
          position: [lane, 0, -30],
          type
        }]);
        lastPowerUpSpawn.current = now;
      }
    };

    const interval = setInterval(spawnPowerUp, 1000);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Sistema de Dificuldade Progressiva
  useEffect(() => {
    if (gameOver) return;

    const speedInterval = setInterval(() => {
      const timePlayed = (Date.now() - gameStartTime.current) / 1000;
      const newSpeed = Math.min(4, 1 + (timePlayed / 30)); // Mais rápido e aumenta mais rápido
      setGameSpeed(newSpeed);
    }, 1000);

    return () => clearInterval(speedInterval);
  }, [gameOver]);

  // Sistema de spawn de inimigos
  useEffect(() => {
    if (gameOver) return;

    const spawnEnemy = () => {
      const now = performance.now();
      const adjustedInterval = INITIAL_SPAWN_INTERVAL / gameSpeed;
      
      if (now - lastSpawn.current > adjustedInterval) {
        const possibleLanes = [-1, 0, 1];
        const lane = possibleLanes[Math.floor(Math.random() * possibleLanes.length)];
        
        let enemyType = 'normal';
        const random = Math.random();
        
        // Inimigos mais difíceis aparecem mais cedo
        if (score > 3000) { // Reduzido de 5000 para 3000
          if (random < 0.15) enemyType = 'boss'; // Aumentado chance de boss
          else if (random < 0.4) enemyType = 'tank'; // Aumentado chance de tank
          else if (random < 0.7) enemyType = 'fast'; // Aumentado chance de fast
        } else if (score > 1500) { // Reduzido de 2000 para 1500
          if (random < 0.25) enemyType = 'tank';
          else if (random < 0.6) enemyType = 'fast';
        } else if (score > 500) { // Reduzido de 1000 para 500
          if (random < 0.4) enemyType = 'fast';
        }

        setEnemies(prev => [...prev, {
          id: Date.now(),
          position: [lane, 0, -30],
          type: enemyType,
          speed: gameSpeed * (enemyType === 'fast' ? 1.2 : 1) // Fast inimigos ainda mais rápidos
        }]);
        lastSpawn.current = now;
      }
    };

    const interval = setInterval(spawnEnemy, 100);
    return () => clearInterval(interval);
  }, [gameOver, gameSpeed, score]);

  // Sistema de perigo por inatividade
  useEffect(() => {
    if (gameOver) return;

    const checkInactivity = () => {
      const now = Date.now();
      if (now - lastMoveTime > DANGER_INTERVAL) {
        // Avisa que vai atacar a lane atual
        if (!warningTimer) {
          const currentLanes = [playerLane];
          setDangerLanes(currentLanes);
          
          // Define timer para o ataque
          const timer = setTimeout(() => {
            // Causa dano se ainda estiver na mesma lane
            if (currentLanes.includes(playerLane)) {
              setHealth(prev => {
                const newHealth = prev - 30;
                onHealthUpdate?.(newHealth);
                if (newHealth <= 0) {
                  setGameOver(true);
                  onGameOver?.();
                }
                return newHealth;
              });
            }
            setDangerLanes([]);
            setWarningTimer(null);
          }, WARNING_TIME);
          
          setWarningTimer(timer);
        }
      }
    };

    const interval = setInterval(checkInactivity, 500);
    return () => {
      clearInterval(interval);
      if (warningTimer) {
        clearTimeout(warningTimer);
      }
    };
  }, [gameOver, lastMoveTime, playerLane, warningTimer]);

  // Atualiza o tempo do último movimento quando o player muda de lane
  const handlePlayerUpdate = (data) => {
    if (data.bullets) {
      setBullets(data.bullets);
    }
    if (data.currentLane !== undefined && data.currentLane !== playerLane) {
      onPlayerLaneChange(data.currentLane);
      setLastMoveTime(Date.now());
      
      // Limpa avisos quando o player se move
      if (warningTimer) {
        clearTimeout(warningTimer);
        setWarningTimer(null);
        setDangerLanes([]);
      }
    }
  };

  const handlePowerUpCollect = (type) => {
    setCurrentPowerUp(type);
    onPowerUpChange?.(type); // Notifica o App.js sobre a mudança
    setTimeout(() => {
      setCurrentPowerUp(null);
      onPowerUpChange?.(null);
    }, 10000);
  };

  // Função de spawn de power-up
  const spawnPowerUp = (enemyType, enemyPosition) => {
    const powerUpTypes = ['doublePoints', 'shield', 'rapidFire', 'multiShot'];
    // Boss sempre dropa um power-up aleatório
    const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    
    setPowerUps(prev => [...prev, {
      id: Date.now(),
      position: [enemyPosition[0], 0, enemyPosition[2]], // Usa a posição do inimigo morto
      type
    }]);
  };

  // Sistema de Kill Streak e Multiplicador
  const handleEnemyKilled = (enemyType, enemyPosition) => {
    const now = Date.now();
    const basePoints = {
      normal: 100,
      fast: 150,
      tank: 200,
      boss: 500
    }[enemyType];

    // Atualiza Kill Streak
    if (now - lastKillTime.current < KILL_STREAK_TIMEOUT) {
      killStreak.current++;
      multiplier.current = Math.min(multiplier.current + 0.1, 3); // Máximo 3x
    } else {
      killStreak.current = 1;
      multiplier.current = 1;
    }
    lastKillTime.current = now;

    // Calcula pontos com multiplicador
    const points = Math.floor(basePoints * multiplier.current);
    setScore(prev => prev + points);
    onScoreUpdate?.(score + points);

    // Mostra texto flutuante com pontos
    createFloatingText(`+${points}`, multiplier.current > 1 ? `${multiplier.current.toFixed(1)}x` : '');

    // Chance de drop de power-up baseada no tipo do inimigo
    const powerUpChance = {
      normal: 0.1,
      fast: 0.15,
      tank: 0.2,
      boss: 1.0
    }[enemyType];

    if (Math.random() < powerUpChance) {
      spawnPowerUp(enemyType, enemyPosition);
    }
  };

  // Texto flutuante de pontos
  const createFloatingText = (points, multiplierText) => {
    // Implementar sistema de texto flutuante em 3D
    // Pode usar HTML ou Three.js Text
  };

  const removeEnemy = (enemyId, wasKilled = false, hitPlayer = false, enemyType = 'normal', enemyPosition = [0, 0, 0]) => {
    setEnemies(prev => prev.filter(enemy => enemy.id !== enemyId));
    
    if (wasKilled) {
      killStreak.current++;
      const newCombo = combo + 1;
      setCombo(newCombo);
      onComboUpdate?.(newCombo);
      
      // Chama handleEnemyKilled com o tipo e posição do inimigo
      handleEnemyKilled(enemyType, enemyPosition);
    } else if (hitPlayer && currentPowerUp !== 'shield') {
      killStreak.current = 0;
      setCombo(0);
      onComboUpdate?.(0);
      setHealth(prev => {
        // Aumentar dano baseado no tipo do inimigo
        const damageMap = {
          'normal': 20,
          'fast': 25,
          'tank': 30,
          'boss': 40
        };
        const damage = damageMap[enemyType] || 20;
        const newHealth = prev - damage;
        onHealthUpdate?.(newHealth);
        if (newHealth <= 0) {
          setGameOver(true);
          onGameOver?.();
        }
        return newHealth;
      });
    }
  };

  // Função auxiliar para converter posição X em índice de lane
  const getLaneIndex = (xPosition) => {
    const laneWidth = 2;
    return Math.round(xPosition / laneWidth) + 1; // Converte -2,0,2 para 0,1,2
  };

  useEffect(() => {
    // Cria novos inimigos periodicamente
    const spawnInterval = setInterval(() => {
      setEnemies(prev => {
        if (prev.length >= 5) return prev; // Limita o número máximo de inimigos
        
        const newEnemy = {
          id: Math.random(),
          position: [-4 + Math.floor(Math.random() * 3) * 4, 0, -20],
          type: Math.random() > 0.7 ? 'fast' : 'normal'
        };
        
        return [...prev, newEnemy];
      });
    }, 2000); // Spawn a cada 2 segundos

    return () => clearInterval(spawnInterval);
  }, []);

  return (
    <group>
      <Background />
      <Player 
        onUpdate={handlePlayerUpdate} 
        gameSpeed={gameSpeed}
        powerUp={currentPowerUp}
        dangerLanes={dangerLanes}
        lane={playerLane}
        onLaneChange={onPlayerLaneChange}
      />
      <Ground />
      
      {/* Indicadores de perigo */}
      {dangerLanes.map((lane, index) => (
        <DangerIndicator 
          key={`danger-${index}`}
          lane={lane}
          warningTime={WARNING_TIME}
        />
      ))}

      {enemies.map((enemy) => (
        <Enemy
          key={enemy.id}
          position={enemy.position}
          type={enemy.type}
          bullets={bullets}
          onEnemyKilled={() => removeEnemy(enemy.id, true, false, enemy.type, enemy.position)}
          onCollision={() => removeEnemy(enemy.id, false, true)}
          speed={enemy.speed}
          playerLane={playerLane}
        />
      ))}

      {powerUps.map((powerUp) => (
        <PowerUp
          key={powerUp.id}
          type={powerUp.type}
          position={powerUp.position}
          onCollect={() => {
            handlePowerUpCollect(powerUp.type);
            setPowerUps(prev => prev.filter(p => p.id !== powerUp.id));
          }}
          playerLane={playerLane}
        />
      ))}

      {/* Kill Streak Display */}
      {killStreak.current > 1 && (
        <KillStreakDisplay
          streak={killStreak.current}
          multiplier={multiplier.current}
        />
      )}
    </group>
  );
}
