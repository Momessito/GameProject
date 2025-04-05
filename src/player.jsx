// Player.jsx
import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import Bullet from "./bullet.jsx";
import { useFBX, useAnimations } from "@react-three/drei";
import playerModel from "./assets/player.fbx";

export default function Player({ onUpdate, gameSpeed = 1, powerUp = null, dangerLanes = [] }) {
  const ref = useRef();
  const modelRef = useRef(); // Referência adicional para o grupo do modelo
  const [lane, setLane] = useState(0);
  const bulletsRef = useRef([]);
  const [_, forceRender] = useState(0);
  const lastShot = useRef(0);
  const shotDelay = 300;
  const touchStartX = useRef(0);
  const SWIPE_THRESHOLD = 50; // Ajuste esse valor para controlar a sensibilidade do swipe

  // Carrega o modelo FBX com animações
  const fbx = useFBX(playerModel);
  const { actions, mixer } = useAnimations(fbx.animations, ref);
  
  // Configuração inicial do modelo
  useEffect(() => {
    if (!fbx) return;

    // Cria um grupo para o modelo
    const modelGroup = new THREE.Group();
    modelGroup.position.set(0, 0, 0);
    
    // Ajusta escala e rotação do modelo FBX
    fbx.scale.set(0.005, 0.005, 0.005);
    fbx.rotation.set(0, Math.PI, 0);
    fbx.position.set(0, 0, 0);

    // Adiciona o modelo ao grupo
    modelGroup.add(fbx);
    modelRef.current = modelGroup;
    ref.current.add(modelGroup);

    // Configura apenas sombras, mantendo materiais originais
    fbx.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.needsUpdate = true;
        }
      }
    });

    return () => {
      fbx.traverse((child) => {
        if (child.isMesh) {
          // Verifica se o material é um array
          if (Array.isArray(child.material)) {
            child.material.forEach(material => {
              if (material && material.dispose) {
                material.dispose();
              }
            });
          } else if (child.material && child.material.dispose) {
            // Se for um único material
            child.material.dispose();
          }
          // Limpa a geometria também
          if (child.geometry && child.geometry.dispose) {
            child.geometry.dispose();
          }
        }
      });
    };
  }, [fbx]);

  // Controle de animação
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstAction = Object.values(actions)[0];
      // Reduz ainda mais a velocidade
      firstAction.timeScale = 0.3; // Velocidade mais lenta
      firstAction.reset().play();
      firstAction.setLoop(THREE.LoopRepeat);
      firstAction.setEffectiveWeight(1);
    }
  }, [actions]);

  // Adicione este estado para controlar o tiro automático
  const [autoShoot, setAutoShoot] = useState(false);

  // Adicione uma ref para controlar o movimento
  const isMoving = useRef(false);

  // Atualiza a animação
  useFrame((state, delta) => {
    if (mixer) {
      mixer.update(delta * 0.5);
      
      // Cancela o movimento para frente da animação
      if (modelRef.current) {
        // Reseta a posição do grupo do modelo a cada frame
        modelRef.current.position.set(0, 0, 2.5);
      }
    }

    if (!ref.current) return;

    // Movimento entre faixas
    const targetX = lane * 2;
    ref.current.position.x = THREE.MathUtils.lerp(
      ref.current.position.x,
      targetX,
      0.1
    );

    // Mantém o jogador parado no eixo Z
    ref.current.position.z = 0;

    // Atualiza câmera atrás do jogador
    const cam = new THREE.Vector3(ref.current.position.x, 2, 5);
    state.camera.position.lerp(cam, 0.1);
    state.camera.lookAt(ref.current.position);
  });

  // Controles de touch e clique
  useEffect(() => {
    const handleTouchStart = (e) => {
      // Captura a posição inicial do toque
      touchStartX.current = e.touches[0].clientX;
      // Sempre ativa o tiro ao tocar
      setAutoShoot(true);
    };

    const handleTouchMove = (e) => {
      if (!touchStartX.current) return;

      const touchEndX = e.touches[0].clientX;
      const deltaX = touchEndX - touchStartX.current;

      if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
        if (deltaX > 0) {
          // Swipe direita
          setLane(l => Math.min(l + 1, 1));
        } else {
          // Swipe esquerda
          setLane(l => Math.max(l - 1, -1));
        }
        touchStartX.current = touchEndX;
      }
    };

    const handleTouchEnd = () => {
      touchStartX.current = 0;
      setAutoShoot(false);
    };

    // Adiciona handler para cliques do mouse
    const handleMouseDown = (e) => {
      // Ignora cliques em botões ou outros elementos interativos
      if (e.target.tagName.toLowerCase() !== 'canvas') return;
      setAutoShoot(true);
    };

    const handleMouseUp = () => {
      setAutoShoot(false);
    };

    // Adiciona os event listeners de touch e clique
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Mantém os controles de teclado para desktop
    const handleKeyDown = (e) => {
      if (e.key === "a" || e.key === "ArrowLeft") setLane(l => Math.max(l - 1, -1));
      if (e.key === "d" || e.key === "ArrowRight") setLane(l => Math.min(l + 1, 1));
      if (e.key === " ") setAutoShoot(true); // Adiciona tiro com espaço
    };

    const handleKeyUp = (e) => {
      if (e.key === " ") setAutoShoot(false); // Para o tiro quando soltar o espaço
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Cleanup
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Efeito de tiro automático
  useEffect(() => {
    if (!autoShoot) return;

    const shoot = () => {
      const pos = ref.current.position.clone();
      
      if (powerUp === 'multiShot') {
        // Atira em 3 direções
        const angles = [-15, 0, 15];
        angles.forEach(angle => {
          const rad = (angle * Math.PI) / 180;
          const direction = new THREE.Vector3(Math.sin(rad), 0, -Math.cos(rad));
          const newBullet = {
            id: Date.now() + Math.random(),
            position: [pos.x, pos.y + 0.5, pos.z - 1],
            direction: direction
          };
          bulletsRef.current = [...bulletsRef.current, newBullet];
        });
      } else {
        // Tiro normal
        const newBullet = {
          id: Date.now() + Math.random(),
          position: [pos.x, pos.y + 0.5, pos.z - 1],
          direction: new THREE.Vector3(0, 0, -1)
        };
        bulletsRef.current = [...bulletsRef.current, newBullet];
      }
      forceRender(n => n + 1);
    };

    const shootInterval = powerUp === 'rapidFire' ? 250 : 500;
    shoot(); // Atira imediatamente ao tocar
    const interval = setInterval(shoot, shootInterval / gameSpeed);
    
    return () => clearInterval(interval);
  }, [gameSpeed, powerUp, autoShoot]);

  useEffect(() => {
    onUpdate?.({ bullets: bulletsRef.current, currentLane: lane });
  }, [lane, bulletsRef.current]);

  // Efeito visual quando em perigo
  useEffect(() => {
    if (!fbx) return;

    if (dangerLanes.includes(lane)) {
      fbx.traverse((child) => {
        if (child.isMesh) {
          child.material.emissive = new THREE.Color(0xff0000);
          child.material.emissiveIntensity = 0.5;
        }
      });
    } else {
      fbx.traverse((child) => {
        if (child.isMesh) {
          child.material.emissive = new THREE.Color(0x000000);
          child.material.emissiveIntensity = 0;
        }
      });
    }
  }, [dangerLanes, lane, fbx]);

  // Adicione estas funções de volta
  const updateBulletPosition = (bulletId, newPosition) => {
    const bullet = bulletsRef.current.find(b => b.id === bulletId);
    if (bullet) {
      bullet.position = newPosition;
      onUpdate?.({ bullets: bulletsRef.current, currentLane: lane });
    }
  };

  const removeBullet = (id) => {
    bulletsRef.current = bulletsRef.current.filter((b) => b.id !== id);
    forceRender(n => n + 1);
  };

  return (
    <group>
      <group 
        ref={ref} 
        position={[0, 0, 0]} 
        rotation={[0, 0, 0]}
      />

      {bulletsRef.current.map((b) => (
        <Bullet
          key={b.id}
          position={b.position}
          onOutOfBounds={() => removeBullet(b.id)}
          onMove={(newPos) => updateBulletPosition(b.id, newPos)}
        />
      ))}
    </group>
  );
}
