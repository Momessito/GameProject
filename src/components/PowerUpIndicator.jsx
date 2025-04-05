import '../styles/hud.css';

export default function PowerUpIndicator({ type }) {
    if (!type) return null;

    const powerUpInfo = {
        doublePoints: { name: "PONTOS DUPLOS!", color: "#FFD700" },
        shield: { name: "ESCUDO ATIVO!", color: "#00FFFF" },
        rapidFire: { name: "TIRO RÁPIDO!", color: "#FF4500" },
        multiShot: { name: "TIRO MÚLTIPLO!", color: "#9400D3" }
    };

    return (
        <div 
            className="power-up-indicator"
            style={{ color: powerUpInfo[type].color, textShadow: `0 0 10px ${powerUpInfo[type].color}` }}
        >
            {powerUpInfo[type].name}
        </div>
    );
} 