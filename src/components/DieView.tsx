import React from 'react';
import { Lock } from 'lucide-react';
import { Theme } from '../store/GameStore';

interface DieViewProps {
  value: number;
  isHeld: boolean;
  theme: Theme;
  isRolling?: boolean;
  onClick: () => void;
}

const animalMap: Record<number, string> = {
  1: '🐭',
  2: '🐱',
  3: '🐶',
  4: '🐷',
  5: '🐵',
  6: '🦁',
};

const NumberDie: React.FC<{ value: number }> = ({ value }) => {
  const dots = [];
  
  if (value === 1 || value === 3 || value === 5) {
    dots.push(<div key="center" className="die-dot dot-center" />);
  }
  if (value >= 2) {
    dots.push(<div key="top-right" className="die-dot dot-top-right" />);
    dots.push(<div key="bottom-left" className="die-dot dot-bottom-left" />);
  }
  if (value >= 4) {
    dots.push(<div key="top-left" className="die-dot dot-top-left" />);
    dots.push(<div key="bottom-right" className="die-dot dot-bottom-right" />);
  }
  if (value === 6) {
    dots.push(<div key="middle-left" className="die-dot dot-middle-left" />);
    dots.push(<div key="middle-right" className="die-dot dot-middle-right" />);
  }

  return <>{dots}</>;
};

export const DieView: React.FC<DieViewProps> = ({ value, isHeld, theme, isRolling, onClick }) => {
  return (
    <div 
      className={`die-container ${isHeld ? 'is-held' : ''} ${isRolling ? 'rolling' : ''}`} 
      onClick={onClick}
      role="button"
      aria-label={`Die ${value} ${isHeld ? 'held' : ''}`}
    >
      {isHeld && <Lock className="padlock-icon" size={24} />}
      
      {theme === Theme.ANIMALS ? (
        <span className="die-animal" role="img" aria-label={`Animal ${value}`}>
          {isRolling ? '❓' : animalMap[value]}
        </span>
      ) : (
        isRolling ? <span className="die-animal">?</span> : <NumberDie value={value} />
      )}
    </div>
  );
};
