// Enemy.jsx
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Enemy({ 
  position, 
  type = 'normal',
  onCollision, 
  bullets, 
  onEnemyKilled, 
  speed = 1, 
  playerLane 
}) {
    const ref = useRef();
    
    // Configuração dos tipos de inimigos
    const enemyTypes = {
        normal: {
            health: 3,
            speed: 0.1,
            scale: 0.8,
            color: '#880000',
            points: 100,
            rotationSpeed: 0.01,
            emissive: 0.3
        },
        fast: {
            health: 2,
            speed: 0.15,
            scale: 0.7,
            color: '#006600',
            points: 150,
            rotationSpeed: 0.02,
            emissive: 0.4
        },
        tank: {
            health: 5,
            speed: 0.07,
            scale: 0.9,
            color: '#000088',
            points: 200,
            rotationSpeed: 0.005,
            emissive: 0.5
        },
        boss: {
            health: 10,
            speed: 0.05,
            scale: 1.2,
            color: '#880088',
            points: 500,
            rotationSpeed: 0.015,
            emissive: 0.6
        }
    };

    const enemyConfig = enemyTypes[type];
    const health = useRef(enemyConfig.health);
    const isDead = useRef(false);
    const currentLane = useRef(Math.floor(position[0]));

    useFrame((state, delta) => {
        if (isDead.current || !ref.current) return;

        // Movimento para frente
        ref.current.position.z += enemyConfig.speed * speed;

        // Ajuste suave para a lane correta
        const targetX = currentLane.current * 2;
        ref.current.position.x = THREE.MathUtils.lerp(
            ref.current.position.x,
            targetX,
            0.1
        );

        // Rotação mais suave
        ref.current.rotation.y += enemyConfig.rotationSpeed * 0.5;

        // Verifica colisões
        if (bullets?.length > 0) {
            for (let bullet of bullets) {
                if (!bullet || isDead.current) continue;

                const enemyBox = new THREE.Box3().setFromObject(ref.current);
                const bulletPos = new THREE.Vector3(...bullet.position);

                if (enemyBox.containsPoint(bulletPos)) {
                    health.current--;
                    if (health.current <= 0) {
                        isDead.current = true;
                        onEnemyKilled?.();
                        break;
                    }
                }
            }
        }
        
        // Colisão com player
        if (ref.current.position.z === 0 && currentLane.current === playerLane) {
            onCollision?.();
            isDead.current = true;
        }

        // Remove se passar do jogador
        if (ref.current.position.z > 50) {
            isDead.current = true;
        }
    });

    return (
        <group ref={ref} position={position}>
            {/* Corpo principal do inimigo - mais alto e ameaçador */}
            <mesh position={[0, 0.8, 0]}>
                <boxGeometry args={[
                    enemyConfig.scale,
                    enemyConfig.scale * 2,
                    enemyConfig.scale * 0.8
                ]} />
                <meshStandardMaterial 
                    color={enemyConfig.color}
                    metalness={0.8}
                    roughness={0.2}
                    emissive={enemyConfig.color}
                    emissiveIntensity={enemyConfig.emissive}
                />
            </mesh>

            {/* Cabeça mais angular e assustadora */}
            <mesh position={[0, 0.8 + enemyConfig.scale * 1.2, 0]} rotation={[0.2, 0, 0]}>
                <octahedronGeometry args={[enemyConfig.scale * 0.4]} />
                <meshStandardMaterial 
                    color={enemyConfig.color}
                    metalness={0.9}
                    roughness={0.1}
                    emissive={enemyConfig.color}
                    emissiveIntensity={enemyConfig.emissive}
                />
            </mesh>

            {/* Olhos mais brilhantes e ameaçadores */}
            <mesh position={[enemyConfig.scale * 0.2, 0.8 + enemyConfig.scale * 1.2, enemyConfig.scale * 0.3]}>
                <sphereGeometry args={[enemyConfig.scale * 0.08]} />
                <meshStandardMaterial 
                    color="red"
                    emissive="red"
                    emissiveIntensity={1}
                />
            </mesh>
            <mesh position={[-enemyConfig.scale * 0.2, 0.8 + enemyConfig.scale * 1.2, enemyConfig.scale * 0.3]}>
                <sphereGeometry args={[enemyConfig.scale * 0.08]} />
                <meshStandardMaterial 
                    color="red"
                    emissive="red"
                    emissiveIntensity={1}
                />
            </mesh>

            {/* Garras/Braços mais afiados */}
            <mesh position={[enemyConfig.scale * 0.7, 0.8, 0]} rotation={[0, 0, Math.PI * 0.2]}>
                <coneGeometry args={[enemyConfig.scale * 0.1, enemyConfig.scale * 1, 4]} />
                <meshStandardMaterial 
                    color={enemyConfig.color}
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>
            <mesh position={[-enemyConfig.scale * 0.7, 0.8, 0]} rotation={[0, 0, -Math.PI * 0.2]}>
                <coneGeometry args={[enemyConfig.scale * 0.1, enemyConfig.scale * 1, 4]} />
                <meshStandardMaterial 
                    color={enemyConfig.color}
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>

            {/* Espinhos nas costas */}
            {[...Array(5)].map((_, i) => (
                <mesh 
                    key={i}
                    position={[0, 0.8 + enemyConfig.scale * (0.5 + i * 0.3), -enemyConfig.scale * 0.3]}
                    rotation={[Math.PI * 0.25, 0, 0]}
                >
                    <coneGeometry args={[enemyConfig.scale * 0.1, enemyConfig.scale * 0.3, 4]} />
                    <meshStandardMaterial 
                        color={enemyConfig.color}
                        metalness={0.9}
                        roughness={0.1}
                    />
                </mesh>
            ))}

            {/* Barra de vida com efeito de energia - corrigido */}
            <mesh position={[0, 0.8 + enemyConfig.scale * 2.2, 0]}>
                <boxGeometry args={[0.8 * (health.current / enemyConfig.health), 0.1, 0.1]} />
                <meshStandardMaterial 
                    color={enemyConfig.color}
                    emissive={enemyConfig.color}
                    emissiveIntensity={0.5}
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>
            <mesh position={[0, 0.8 + enemyConfig.scale * 2.2, 0]}>
                <boxGeometry args={[0.8, 0.12, 0.12]} />
                <meshBasicMaterial 
                    color="black" 
                    transparent={true} 
                    opacity={0.7} 
                    wireframe={true}
                />
            </mesh>
        </group>
    );
}
  