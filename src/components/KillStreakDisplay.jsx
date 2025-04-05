import { Html } from '@react-three/drei';

export default function KillStreakDisplay({ streak, multiplier }) {
    return (
        <Html position={[0, 2, -5]} center>
            <div style={{
                color: '#ff0',
                fontSize: '24px',
                fontWeight: 'bold',
                textShadow: '0 0 10px #ff0',
                animation: 'pulse 0.5s infinite alternate',
                padding: '10px',
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: '10px',
                textAlign: 'center'
            }}>
                <div>{streak} KILLS!</div>
                <div style={{ fontSize: '18px', color: '#f0f' }}>
                    {multiplier.toFixed(1)}x MULTIPLIER!
                </div>
            </div>
        </Html>
    );
} 