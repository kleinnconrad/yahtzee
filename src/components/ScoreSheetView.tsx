import React from 'react';
import { useGame, Theme } from '../store/GameStore';
import type { ScoreSheet } from '../store/GameStore';
import { ScoreEngine } from '../logic/ScoreEngine';

const animalLabels: Record<string, string> = {
  ones: '🐭 Collect Mice',
  twos: '🐱 Collect Cats',
  threes: '🐶 Collect Dogs',
  fours: '🐷 Collect Pigs',
  fives: '🐵 Collect Monkeys',
  sixes: '🦁 Collect Lions',
};

const numberLabels: Record<string, string> = {
  ones: '⚀ Collect Ones',
  twos: '⚁ Collect Twos',
  threes: '⚂ Collect Threes',
  fours: '⚃ Collect Fours',
  fives: '⚄ Collect Fives',
  sixes: '⚅ Collect Sixes',
};

const lowerLabels: Record<string, string> = {
  threeOfAKind: '3 of a Kind',
  fourOfAKind: '4 of a Kind',
  fullHouse: 'Full House (25)',
  smallStraight: 'Small Straight (30)',
  largeStraight: 'Large Straight (40)',
  yahtzee: 'Yahtzee! (50)',
  chance: 'Chance',
};

const getUpperLabels = (theme: Theme) => theme === Theme.ANIMALS ? animalLabels : numberLabels;

export const ScoreSheetView: React.FC = () => {
  const { state, dispatch } = useGame();
  
  const upperLabels = getUpperLabels(state.theme);
  const categories = [...Object.keys(upperLabels), ...Object.keys(lowerLabels)] as Array<keyof ScoreSheet>;

  const calculateTotal = (sheet: ScoreSheet) => {
    return Object.values(sheet).reduce((sum, val) => sum + (val || 0), 0);
  };

  const handleScore = (category: keyof ScoreSheet) => {
    const currentPlayer = state.players[state.currentPlayerIndex];
    if (currentPlayer.scoreSheet[category] !== null) return; // already scored
    
    const possibleScore = ScoreEngine[category](state.diceValues);
    
    if (possibleScore === 0) {
      if (!window.confirm(`Are you sure? This gives 0 points! 😢`)) {
        return;
      }
    }
    
    dispatch({ type: 'RECORD_SCORE', payload: { category, score: possibleScore } });
  };

  return (
    <div className="score-sheet-wrapper">
      <div className="score-grid-table">
        <div className="score-header-row">
          <div className="score-cell label-cell"></div>
          {state.players.map((p, idx) => (
            <div key={p.id} className={`score-cell header-cell ${idx === state.currentPlayerIndex ? 'active-player' : ''}`}>
              {p.name}
            </div>
          ))}
        </div>
        
        {categories.map((cat) => {
          const label = upperLabels[cat] || lowerLabels[cat];
          
          return (
            <div key={cat} className="score-table-row">
              <div className="score-cell label-cell">{label}</div>
              
              {state.players.map((p, idx) => {
                const isActive = idx === state.currentPlayerIndex;
                const isScored = p.scoreSheet[cat] !== null;
                const actualScore = p.scoreSheet[cat];
                
                let previewScore = null;
                if (isActive && !isScored && state.rollsLeft < 3) {
                  previewScore = ScoreEngine[cat](state.diceValues);
                }

                return (
                  <button 
                    key={p.id}
                    className={`score-cell value-cell ${isScored ? 'scored' : ''} ${isActive ? 'active-column' : ''}`}
                    onClick={() => handleScore(cat)}
                    disabled={!isActive || isScored || state.rollsLeft === 3}
                  >
                    {isScored ? (
                      <span className="actual-score">{actualScore}</span>
                    ) : previewScore !== null ? (
                      <span className="preview-score">{previewScore}</span>
                    ) : (
                      <span className="empty-score">-</span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
        
        {/* Total Row */}
        <div className="score-table-row" style={{ marginTop: '16px', borderTop: '2px dashed var(--primary-color)', paddingTop: '8px' }}>
          <div className="score-cell label-cell" style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }}>🏆 Total Score</div>
          {state.players.map((p, idx) => {
            const isActive = idx === state.currentPlayerIndex;
            return (
              <div 
                key={p.id} 
                className={`score-cell header-cell ${isActive ? 'active-player' : ''}`}
                style={{ fontSize: '1.3rem' }}
              >
                {calculateTotal(p.scoreSheet)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
