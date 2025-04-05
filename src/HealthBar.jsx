// HealthBar.jsx
import React from 'react';

export default function HealthBar({ health }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '15px',
        borderRadius: '10px',
        color: '#fff',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ marginBottom: '5px' }}>VIDA</div>
      <div style={{ 
        width: '200px', 
        height: '20px', 
        backgroundColor: '#333',
        borderRadius: '5px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${health}%`,
          height: '100%',
          backgroundColor: health > 50 ? '#4CAF50' : health > 25 ? '#FFA500' : '#FF0000',
          transition: 'width 0.3s, background-color 0.3s'
        }} />
      </div>
    </div>
  );
}