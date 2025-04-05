// Enemy.jsx
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF, useAnimations } from "@react-three/drei";
import zombieModel from "./assets/Zombie.glb";

export default function Enemy({ position = [1000, 0.5, 0], onCollision, bullets, onEnemyKilled }) {
    const ref = useRef();
    const enemyBox = new THREE.Box3();

    // Carrega o modelo 3D e suas animações
    const { scene, animations } = useGLTF(zombieModel);
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

        // Configura sombras para o modelo
        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, [scene, actions]);

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
        if (ref.current.position.z > 5) {
            onCollision?.();
        }
    });

    return (
        <group 
            ref={ref} 
            position={position}
            scale={[0.010, 0.010, 0.010]} // Aumentei um pouco a escala
            rotation={[0, 0.1, 0]} // Ajustei a rotação para olhar na direção correta
        >
            <primitive object={scene} />
        </group>
    );
}

// Pré-carrega o modelo
useGLTF.preload(zombieModel);
  