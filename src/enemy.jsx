// Enemy.jsx
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Enemy({ position = [0, 0.5, 0], onCollision, bullets, onEnemyKilled }) {
    const ref = useRef();
    const enemyBox = new THREE.Box3();

    useFrame(() => {
        if (!ref.current) return;

        // Move o inimigo para frente
        ref.current.position.z += 0.1;

        // Atualiza a caixa de colisão do inimigo
        enemyBox.setFromObject(ref.current);

        // Verifica colisão com balas
        bullets?.forEach((bullet, index) => {
            if (!bullet) return;
            
            const bulletPos = new THREE.Vector3(...bullet.position);
            const bulletSphere = new THREE.Sphere(bulletPos, 0.3);

            if (enemyBox.intersectsSphere(bulletSphere)) {
                // Remove a bala e mata o inimigo
                console.log("colidiu");
                bullets.splice(index, 1);
                onEnemyKilled?.();
            }
        });

        // Verifica se passou do jogador
        if (ref.current.position.z > 50) {
            onCollision?.();
        }
    });

    return (
        <mesh 
            ref={ref} 
            position={position}
            castShadow
            receiveShadow
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial 
                color="red"
                emissive="red"
                emissiveIntensity={0.2}
            />
        </mesh>
    );
}
  