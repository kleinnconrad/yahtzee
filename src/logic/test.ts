import { ScoreEngine } from './ScoreEngine.js'; // adding .js for node esm resolution if needed or just execute via tsx

const runTests = () => {
  console.log("Testing ScoreEngine...");
  
  // Ones to Sixes
  console.log("Ones [1,1,2,3,4]:", ScoreEngine.ones([1, 1, 2, 3, 4]) === 2 ? "PASS" : "FAIL");
  
  // Three of a kind
  console.log("Three of a Kind [2,2,2,3,5]:", ScoreEngine.threeOfAKind([2, 2, 2, 3, 5]) === 14 ? "PASS" : "FAIL");
  
  // Full House
  console.log("Full House [2,2,2,3,3]:", ScoreEngine.fullHouse([2, 2, 2, 3, 3]) === 25 ? "PASS" : "FAIL");
  console.log("Full House [2,2,2,2,3]:", ScoreEngine.fullHouse([2, 2, 2, 2, 3]) === 0 ? "PASS" : "FAIL");

  // Small Straight
  console.log("Small Straight [1,2,3,4,4]:", ScoreEngine.smallStraight([1, 2, 3, 4, 4]) === 30 ? "PASS" : "FAIL");
  console.log("Small Straight [2,3,4,5,1]:", ScoreEngine.smallStraight([2, 3, 4, 5, 1]) === 30 ? "PASS" : "FAIL");
  console.log("Small Straight (not straight) [1,2,3,5,6]:", ScoreEngine.smallStraight([1, 2, 3, 5, 6]) === 0 ? "PASS" : "FAIL");

  // Large Straight
  console.log("Large Straight [1,2,3,4,5]:", ScoreEngine.largeStraight([1, 2, 3, 4, 5]) === 40 ? "PASS" : "FAIL");
  console.log("Large Straight [2,3,4,5,6]:", ScoreEngine.largeStraight([2, 3, 4, 5, 6]) === 40 ? "PASS" : "FAIL");

  // Yahtzee
  console.log("Yahtzee [6,6,6,6,6]:", ScoreEngine.yahtzee([6, 6, 6, 6, 6]) === 50 ? "PASS" : "FAIL");

  // Chance
  console.log("Chance [1,1,1,1,1]:", ScoreEngine.chance([1, 1, 1, 1, 1]) === 5 ? "PASS" : "FAIL");
};

runTests();
