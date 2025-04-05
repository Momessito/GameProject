// ScoreDisplay.jsx
import React from 'react';

export default function ScoreDisplay({ score }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#fff',
        padding: '15px 25px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        fontFamily: 'Arial, sans-serif',
        userSelect: 'none',
        zIndex: 1000
      }}
    >
      <div style={{ fontSize: '16px', marginBottom: '5px' }}>PONTUAÇÃO</div>
      <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{score}</div>
    </div>
  );
}