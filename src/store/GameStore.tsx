import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { DiceArray } from '../logic/ScoreEngine';

export enum Theme {
  NUMBERS = 'NUMBERS',
  ANIMALS = 'ANIMALS',
}

export enum GamePhase {
  SETUP = 'SETUP',
  START = 'START',
  ROLLING = 'ROLLING',
  SELECT_DICE = 'SELECT_DICE',
  SELECT_SCORE = 'SELECT_SCORE',
  GAME_OVER = 'GAME_OVER',
}

export interface ScoreSheet {
  ones: number | null;
  twos: number | null;
  threes: number | null;
  fours: number | null;
  fives: number | null;
  sixes: number | null;
  threeOfAKind: number | null;
  fourOfAKind: number | null;
  fullHouse: number | null;
  smallStraight: number | null;
  largeStraight: number | null;
  yahtzee: number | null;
  chance: number | null;
}

export interface Player {
  id: string;
  name: string;
  scoreSheet: ScoreSheet;
}

export interface GameState {
  theme: Theme;
  players: Player[];
  currentPlayerIndex: number;
  diceValues: DiceArray;
  heldDice: [boolean, boolean, boolean, boolean, boolean];
  rollsLeft: number;
  gamePhase: GamePhase;
}

const initialScoreSheet: ScoreSheet = {
  ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null,
  threeOfAKind: null, fourOfAKind: null, fullHouse: null,
  smallStraight: null, largeStraight: null, yahtzee: null, chance: null,
};

export const initialState: GameState = {
  theme: Theme.NUMBERS,
  players: [],
  currentPlayerIndex: 0,
  diceValues: [1, 1, 1, 1, 1],
  heldDice: [false, false, false, false, false],
  rollsLeft: 3,
  gamePhase: GamePhase.SETUP,
};

export type GameAction =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'START_GAME'; payload: { playerNames: string[] } }
  | { type: 'ROLL_DICE' }
  | { type: 'TOGGLE_HOLD'; payload: number }
  | { type: 'RECORD_SCORE'; payload: { category: keyof ScoreSheet; score: number } }
  | { type: 'RESET_GAME' };

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
      
    case 'START_GAME':
      const newPlayers: Player[] = action.payload.playerNames.map((name, i) => ({
        id: `player_${i}`,
        name: name,
        scoreSheet: { ...initialScoreSheet }
      }));
      return {
        ...initialState,
        theme: state.theme, // preserve theme
        players: newPlayers,
        gamePhase: GamePhase.START,
      };

    case 'ROLL_DICE':
      if (state.rollsLeft <= 0 || state.gamePhase === GamePhase.GAME_OVER) return state;
      const newDiceValues = state.diceValues.map((val, idx) =>
        state.heldDice[idx] ? val : Math.floor(Math.random() * 6) + 1
      ) as DiceArray;
      return {
        ...state,
        diceValues: newDiceValues,
        rollsLeft: state.rollsLeft - 1,
        gamePhase: state.rollsLeft - 1 === 0 ? GamePhase.SELECT_SCORE : GamePhase.SELECT_DICE,
      };

    case 'TOGGLE_HOLD':
      if (state.gamePhase === GamePhase.START || state.rollsLeft === 0) return state;
      const newHeld = [...state.heldDice] as [boolean, boolean, boolean, boolean, boolean];
      newHeld[action.payload] = !newHeld[action.payload];
      return { ...state, heldDice: newHeld };

    case 'RECORD_SCORE':
      if (state.gamePhase === GamePhase.GAME_OVER) return state;
      
      const currentPlayer = state.players[state.currentPlayerIndex];
      if (currentPlayer.scoreSheet[action.payload.category] !== null) return state; // Already scored

      const updatedScoreSheet = {
        ...currentPlayer.scoreSheet,
        [action.payload.category]: action.payload.score,
      };

      const updatedPlayers = [...state.players];
      updatedPlayers[state.currentPlayerIndex] = { ...currentPlayer, scoreSheet: updatedScoreSheet };

      let nextPlayerIndex = state.currentPlayerIndex + 1;
      let nextPhase = GamePhase.START;
      
      // Check if game is over (all players filled all 13 categories)
      // We can just check if the last player just filled their last category.
      const isLastPlayer = nextPlayerIndex >= updatedPlayers.length;
      if (isLastPlayer) {
        nextPlayerIndex = 0; // wrap around
        // Did the last player fill everything?
        const lastPlayerSheet = updatedPlayers[updatedPlayers.length - 1].scoreSheet;
        const allFilled = Object.values(lastPlayerSheet).every(val => val !== null);
        if (allFilled) {
          nextPhase = GamePhase.GAME_OVER;
        }
      }

      return {
        ...state,
        players: updatedPlayers,
        currentPlayerIndex: nextPlayerIndex,
        rollsLeft: 3,
        heldDice: [false, false, false, false, false],
        gamePhase: nextPhase,
        diceValues: [1, 1, 1, 1, 1], // Reset visuals
      };

    case 'RESET_GAME':
      return { ...initialState, theme: state.theme };
      
    default:
      return state;
  }
};

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
