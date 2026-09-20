export type DiceArray = [number, number, number, number, number];

export const ScoreEngine = {
  // Upper Section
  sumNumber: (dice: DiceArray, target: number): number => {
    return dice.filter((d) => d === target).reduce((sum, val) => sum + val, 0);
  },
  ones: (dice: DiceArray) => ScoreEngine.sumNumber(dice, 1),
  twos: (dice: DiceArray) => ScoreEngine.sumNumber(dice, 2),
  threes: (dice: DiceArray) => ScoreEngine.sumNumber(dice, 3),
  fours: (dice: DiceArray) => ScoreEngine.sumNumber(dice, 4),
  fives: (dice: DiceArray) => ScoreEngine.sumNumber(dice, 5),
  sixes: (dice: DiceArray) => ScoreEngine.sumNumber(dice, 6),

  // Lower Section
  _getCounts: (dice: DiceArray): Record<number, number> => {
    const counts: Record<number, number> = {};
    for (const d of dice) {
      counts[d] = (counts[d] || 0) + 1;
    }
    return counts;
  },

  threeOfAKind: (dice: DiceArray): number => {
    const counts = ScoreEngine._getCounts(dice);
    const hasThree = Object.values(counts).some((count) => count >= 3);
    return hasThree ? dice.reduce((sum, val) => sum + val, 0) : 0;
  },

  fourOfAKind: (dice: DiceArray): number => {
    const counts = ScoreEngine._getCounts(dice);
    const hasFour = Object.values(counts).some((count) => count >= 4);
    return hasFour ? dice.reduce((sum, val) => sum + val, 0) : 0;
  },

  fullHouse: (dice: DiceArray): number => {
    const counts = ScoreEngine._getCounts(dice);
    const values = Object.values(counts);
    const hasThree = values.includes(3);
    const hasTwo = values.includes(2);
    if ((hasThree && hasTwo) || values.includes(5)) {
      return 25;
    }
    return 0;
  },

  smallStraight: (dice: DiceArray): number => {
    const uniqueVals = Array.from(new Set(dice)).sort();
    const str = uniqueVals.join('');
    if (str.includes('1234') || str.includes('2345') || str.includes('3456')) {
      return 30;
    }
    return 0;
  },

  largeStraight: (dice: DiceArray): number => {
    const uniqueVals = Array.from(new Set(dice)).sort();
    const str = uniqueVals.join('');
    if (str.includes('12345') || str.includes('23456')) {
      return 40;
    }
    return 0;
  },

  yahtzee: (dice: DiceArray): number => {
    const counts = ScoreEngine._getCounts(dice);
    const values = Object.values(counts);
    return values.includes(5) ? 50 : 0;
  },

  chance: (dice: DiceArray): number => {
    return dice.reduce((sum, val) => sum + val, 0);
  }
};
