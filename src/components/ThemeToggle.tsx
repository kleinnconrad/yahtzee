import React from 'react';
import { useGame, Theme } from '../store/GameStore';

export const ThemeToggle: React.FC = () => {
  const { state, dispatch } = useGame();

  return (
    <div className="theme-toggle-container">
      <button 
        className={`theme-btn ${state.theme === Theme.NUMBERS ? 'active' : ''}`}
        onClick={() => dispatch({ type: 'SET_THEME', payload: Theme.NUMBERS })}
      >
        Numbers 🎲
      </button>
      <button 
        className={`theme-btn ${state.theme === Theme.ANIMALS ? 'active' : ''}`}
        onClick={() => dispatch({ type: 'SET_THEME', payload: Theme.ANIMALS })}
      >
        Animals 🦁
      </button>
    </div>
  );
};
