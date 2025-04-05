// Player.jsx
import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import Bullet from "./bullet.jsx";
import { useGLTF, useAnimations } from "@react-three/drei";
import stormtrooper from "./assets/stormtrooper_walk.glb";

export default function Player({ onUpdate }) {
  const ref = useRef();
  const [lane, setLane] = useState(0);
  const bulletsRef = useRef([]);
  const [_, forceRender] = useState(0); // força re-render
  const lastShot = useRef(0);
  const shotDelay = 300;

  // Carrega o modelo 3D e suas animações
  const { scene, animations } = useGLTF(stormtrooper);
  const { actions } = useAnimations(animations, ref);

  // Inicia a animação quando o componente montar
  useEffect(() => {
    // Verifica se existe uma animação e a inicia
    const actionNames = Object.keys(actions);
    if (actionNames.length > 0) {
      // Pega a primeira animação disponível
      const firstAction = actions[actionNames[0]];
      firstAction.reset().play();
      firstAction.setLoop(THREE.LoopRepeat);
    }

    // Log para debug - mostra todas as animações disponíveis
    console.log("Animações disponíveis:", Object.keys(actions));
  }, [actions]);

  useFrame((state) => {
    if (!ref.current) return;

    // Mantém o jogador parado no eixo Z
    ref.current.position.z = 0;

    // Movimento entre faixas
    const targetX = lane * 2;
    ref.current.position.x = THREE.MathUtils.lerp(
      ref.current.position.x,
      targetX,
      0.1
    );

    // Atualiza câmera atrás do jogador
    const cam = new THREE.Vector3(ref.current.position.x, 2, 5);
    state.camera.position.lerp(cam, 0.1);
    state.camera.lookAt(ref.current.position);

    // Tiro automático
    const now = performance.now();
    if (now - lastShot.current > shotDelay) {
      shoot();
      lastShot.current = now;
    }

    // Envia update para a cena
    onUpdate?.({
      bullets: bulletsRef.current,
    });
  });

  const shoot = () => {
    const pos = ref.current.position.clone();
    const newBullet = {
      id: Date.now() + Math.random(),
      position: [pos.x, pos.y, pos.z - 1],
    };
    bulletsRef.current = [...bulletsRef.current, newBullet];
    forceRender((n) => n + 1);
  };

  const updateBulletPosition = (bulletId, newPosition) => {
    const bullet = bulletsRef.current.find(b => b.id === bulletId);
    if (bullet) {
      bullet.position = newPosition;
      onUpdate?.({ bullets: bulletsRef.current });
    }
  };

  const removeBullet = (id) => {
    bulletsRef.current = bulletsRef.current.filter((b) => b.id !== id);
    forceRender((n) => n + 1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "a" || e.key === "ArrowLeft") setLane(-1);
    if (e.key === "d" || e.key === "ArrowRight") setLane(1);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);  

  // Clone e configure o modelo
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [scene]);

  return (
    <>
      <group 
        ref={ref} 
        position={[0, 0.1, 0]} 
        scale={[0.005, 0.005, 0.005]}
        rotation={[0, 14.3, 0]}
      >
        <primitive object={scene} />
      </group>

      {bulletsRef.current.map((b) => (
        <Bullet
          key={b.id}
          position={b.position}
          onOutOfBounds={() => removeBullet(b.id)}
          onMove={(newPos) => updateBulletPosition(b.id, newPos)}
        />
      ))}
    </>
  );
}

// Pré-carrega o modelo usando o caminho importado
useGLTF.preload(stormtrooper);
