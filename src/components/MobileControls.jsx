import React from 'react';

export function MobileControls({ onLeft, onRight }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '0',
      right: '0',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '20px',
      zIndex: 1000,
      pointerEvents: 'none',
    }}>
      <div style={{ display: 'flex', gap: '20px', pointerEvents: 'auto' }}>
        <button
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            color: 'white',
            fontSize: '24px',
            touchAction: 'manipulation',
          }}
          onTouchStart={onLeft}
        >
          ←
        </button>
        <button
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            color: 'white',
            fontSize: '24px',
            touchAction: 'manipulation',
          }}
          onTouchStart={onRight}
        >
          →
        </button>
      </div>
    </div>
  );
} 