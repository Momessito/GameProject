import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

export default function PowerUp({ position, type, onCollect, playerLane }) {
    const ref = useRef();
    const startY = position[1];
    const hasCollected = useRef(false);

    // Cores diferentes para cada tipo de power-up
    const powerUpColors = {
        doublePoints: "#FFD700", // Dourado
        shield: "#00FFFF",      // Ciano
        rapidFire: "#FF4500",   // Vermelho-laranja
        multiShot: "#9400D3"    // Roxo
    };

    // Converte posição X em índice de lane (-1, 0, 1)
    const getLaneFromPosition = (x) => Math.round(x / 2);

    useFrame((state) => {
        if (!ref.current || hasCollected.current) return;

        // Movimento de flutuação
        ref.current.position.y = 1;
        
        // Rotação constante
        ref.current.rotation.y += 0.02;

        // Movimento em direção ao jogador
        ref.current.position.z += 0.15;

        // Verifica se está na zona de coleta e na mesma lane do player
        if (ref.current.position.z > 0 && ref.current.position.z < 1) {
            const powerUpLane = getLaneFromPosition(ref.current.position.x);
            if (powerUpLane === playerLane) {
                hasCollected.current = true;
                onCollect();
                ref.current.removeFromParent();
            }
        }

        // Remove se passar muito do jogador
        if (ref.current.position.z > 8) {
            ref.current.removeFromParent();
        }
    });

    return (
        <mesh 
            position={[position[0], 1.5, position[2]]}
            ref={ref}
        >
            {/* Esfera central */}
            <mesh castShadow>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshStandardMaterial
                    color={powerUpColors[type]}
                    emissive={powerUpColors[type]}
                    emissiveIntensity={0.5}
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>

            {/* Anel externo */}
            <mesh rotation-x={Math.PI / 2}>
                <torusGeometry args={[0.8, 0.1, 16, 32]} />
                <meshStandardMaterial
                    color={powerUpColors[type]}
                    emissive={powerUpColors[type]}
                    emissiveIntensity={0.3}
                    transparent
                    opacity={0.6}
                />
            </mesh>

            {/* Efeito de brilho */}
            <pointLight
                color={powerUpColors[type]}
                intensity={1}
                distance={3}
            />
        </mesh>
    );
} 