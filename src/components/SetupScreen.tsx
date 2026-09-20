import React, { useState } from 'react';
import { useGame } from '../store/GameStore';

export const SetupScreen: React.FC = () => {
  const { dispatch } = useGame();
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerNames, setPlayerNames] = useState<string[]>(['Player 1', 'Player 2']);

  const handleNumChange = (num: number) => {
    setNumPlayers(num);
    const newNames = Array(num).fill('').map((_, i) => playerNames[i] || `Player ${i + 1}`);
    setPlayerNames(newNames);
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStart = () => {
    dispatch({ type: 'START_GAME', payload: { playerNames } });
  };

  return (
    <div className="setup-screen" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '40px'
    }}>
      <h2 style={{ color: 'var(--primary-color)', fontSize: '2rem' }}>Who is playing?</h2>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[1, 2, 3, 4].map((num) => (
          <button 
            key={num}
            onClick={() => handleNumChange(num)}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              background: num === numPlayers ? 'var(--secondary-color)' : '#eee',
              color: num === numPlayers ? 'white' : '#666',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {num} Player{num > 1 ? 's' : ''}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px', width: '100%', maxWidth: '300px' }}>
        {playerNames.map((name, idx) => (
          <input 
            key={idx}
            type="text"
            value={name}
            onChange={(e) => handleNameChange(idx, e.target.value)}
            placeholder={`Player ${idx + 1}`}
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #ddd',
              fontSize: '1.1rem',
              fontFamily: 'inherit'
            }}
          />
        ))}
      </div>

      <button 
        onClick={handleStart}
        style={{
          marginTop: '30px',
          padding: '16px 40px',
          fontSize: '1.5rem',
          borderRadius: '24px',
          background: 'var(--primary-color)',
          color: 'white',
          border: 'none',
          boxShadow: '0 6px 0 #d81b60',
          cursor: 'pointer',
          fontWeight: 900
        }}
      >
        START GAME! 🚀
      </button>
    </div>
  );
};
