import '../styles/hud.css';

export default function ComboDisplay({ combo }) {
    if (combo <= 0) return null;

    return (
        <div className="combo-display">
            {combo}x COMBO!
        </div>
    );
} 