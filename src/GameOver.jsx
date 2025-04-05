import React from 'react';

export default function GameOver({ score }) {
  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        padding: '30px',
        borderRadius: '15px',
        color: '#fff',
        zIndex: 100000000000,
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        minWidth: '300px',
        pointerEvents: 'auto'
      }}
    >
      <h2>GAME OVER</h2>
      <p style={{ fontSize: '24px', margin: '20px 0' }}>
        Pontuação Final: {score}
      </p>
      <button
        onClick={handleRestart}
        style={{
          padding: '10px 20px',
          fontSize: '18px',
          backgroundColor: '#4CAF50',
          border: 'none',
          borderRadius: '5px',
          color: '#fff',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
          pointerEvents: 'auto',
          position: 'relative',
          zIndex: 100000000001
        }}
        onMouseOver={e => e.target.style.backgroundColor = '#45a049'}
        onMouseOut={e => e.target.style.backgroundColor = '#4CAF50'}
      >
        Jogar Novamente
      </button>
    </div>
  );
} 