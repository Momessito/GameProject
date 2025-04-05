import { useRef } from 'react';
import { useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import mountainTexture from './assets/mountain.png';

export default function Background() {
    const { scene } = useThree();
    const texture = useLoader(THREE.TextureLoader, mountainTexture);

    // Configura o céu noturno
    scene.background = new THREE.Color('#050518');

    return (
        <group>
            {/* Imagem de fundo das montanhas */}
            <mesh position={[0, 0, -120]} scale={[300, 100, 1]}>
                <planeGeometry />
                <meshBasicMaterial 
                    castShadow={true}
                    map={texture}
                    transparent={true}
                    opacity={1}
                />
            </mesh>

            {/* Estrelas */}
            {[...Array(200)].map((_, i) => (
                <mesh 
                    key={i} 
                    position={[
                        Math.random() * 100 - 50,
                        Math.random() * 30 + 10,
                        Math.random() * -30 - 20
                    ]}
                >
                    <sphereGeometry args={[0.05, 8, 8]} />
                    <meshBasicMaterial 
                        color="#ffffff"
                        emissive="#ffffff"
                        emissiveIntensity={Math.random() * 0.5 + 0.5}
                    />
                </mesh>
            ))}

            {/* Lua */}
            <mesh position={[20, 25, -40]}>
                <sphereGeometry args={[3, 32, 32]} />
                <meshBasicMaterial 
                    color="#fffae6"
                    emissive="#fffae6"
                    emissiveIntensity={0.8}
                />
            </mesh>

            {/* Iluminação */}
            <ambientLight intensity={0.2} />
            <directionalLight 
                position={[20, 25, -40]} 
                intensity={0.3} 
                color="#fffae6"
            />
        </group>
    );
} 