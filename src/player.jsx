// Player.jsx
import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import Bullet from "./bullet.jsx";

export default function Player({ onUpdate }) {
  const ref = useRef();
  const [lane, setLane] = useState(0);
  const bulletsRef = useRef([]);
  const [_, forceRender] = useState(0); // força re-render
  const lastShot = useRef(0);
  const shotDelay = 300;

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

  return (
    <>
      <mesh ref={ref} position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="blue" />
      </mesh>

      {bulletsRef.current.map((b) => (
        <Bullet
          key={b.id}
          position={b.position}
          onOutOfBounds={() => removeBullet(b.id)}
        />
      ))}
    </>
  );
}
