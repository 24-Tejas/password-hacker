import { evaluateGuess, validateGuess, canAppendChar, isWinningFeedback } from './src/game/feedback.js';
import { getDailyChallenge, generatePracticeCode } from './src/game/dailyGenerator.js';
import { calculateScore, recordGameStats, INITIAL_STATS } from './src/game/scoring.js';
import { getTimeUntilNextUtcMidnight, formatDuration } from './src/utils/dateUtils.js';

console.log('=== STARTING COMPLETE TEST SUITE (WORDLE LETTERS ONLY) ===');

let testsPassed = 0;
function it(title, fn) {
  try {
    fn();
    console.log(`✓ ${title}`);
    testsPassed++;
  } catch (err) {
    console.error(`✗ ${title}`);
    console.error(err);
    process.exit(1);
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) throw new Error(`Expected ${expected} but received ${actual}`);
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)} but received ${JSON.stringify(actual)}`);
      }
    },
    toBeGreaterThan(expected) {
      if (actual <= expected) throw new Error(`Expected ${actual} > ${expected}`);
    },
    toBeTruthy() {
      if (!actual) throw new Error(`Expected truthy but got ${actual}`);
    },
    toBeFalsy() {
      if (actual) throw new Error(`Expected falsy but got ${actual}`);
    }
  };
}

// 1. FEEDBACK ALGORITHM EDGE CASES
it('evaluates exact 5-letter match with all correct (Green)', () => {
  const result = evaluateGuess('CYBER', 'CYBER');
  expect(result).toEqual(['correct', 'correct', 'correct', 'correct', 'correct']);
  expect(isWinningFeedback(result)).toBe(true);
});

it('evaluates completely disjoint guess with all wrong (Grey)', () => {
  const result = evaluateGuess('CLOUD', 'RESET');
  expect(result).toEqual(['wrong', 'wrong', 'wrong', 'wrong', 'wrong']);
  expect(isWinningFeedback(result)).toBe(false);
});

it('evaluates anagram/permutation with all misplaced (Yellow)', () => {
  const result = evaluateGuess('TRACE', 'CATER');
  expect(result.every((s) => s === 'misplaced' || s === 'correct')).toBe(true);
});

it('handles duplicate letters in guess correctly (canonical Wordle 2-pass)', () => {
  // Secret: PROXY (only one 'P')
  // Guess: APPLE (two 'P's: index 1 should match misplaced, index 2 should be wrong)
  const res1 = evaluateGuess('APPLE', 'PROXY');
  expect(res1[1]).toBe('misplaced');
  expect(res1[2]).toBe('wrong');

  // Secret: SPEED (E at index 2 and 3)
  // Guess: RESET (E at index 3 matches secret index 3 -> correct, E at index 1 matches secret index 2 -> misplaced)
  const res2 = evaluateGuess('RESET', 'SPEED');
  expect(res2[1]).toBe('misplaced');
  expect(res2[3]).toBe('correct');
});

// 2. INPUT VALIDATION (LETTERS ONLY)
it('validates correct 5-letter word', () => {
  expect(validateGuess('TOKEN').valid).toBe(true);
});

it('allows duplicate letters in guesses just like Wordle', () => {
  expect(validateGuess('SPEED').valid).toBe(true);
});

it('rejects numbers (letters only)', () => {
  const v = validateGuess('CYB3R');
  expect(v.valid).toBe(false);
  expect(v.error.includes('INVALID CHARACTER')).toBe(true);
});

it('rejects non-alphabet characters', () => {
  const v = validateGuess('PASS#');
  expect(v.valid).toBe(false);
  expect(v.error.includes('INVALID CHARACTER')).toBe(true);
});

it('rejects short words', () => {
  const v = validateGuess('PASS');
  expect(v.valid).toBe(false);
  expect(v.error.includes('TOO SHORT')).toBe(true);
});

it('rejects already attempted guess', () => {
  const v = validateGuess('CYBER', ['CYBER']);
  expect(v.valid).toBe(false);
  expect(v.error.includes('REPEAT GUESS')).toBe(true);
});

it('prevents appending numbers or non-letters', () => {
  expect(canAppendChar('1', 'CY').allowed).toBe(false);
  expect(canAppendChar('$', 'CY').allowed).toBe(false);
  expect(canAppendChar('B', 'CY').allowed).toBe(true);
  expect(canAppendChar('Z', 'CYBER').allowed).toBe(false); // full buffer
});

// 3. DETERMINISTIC DAILY GENERATOR
it('generates identical daily password for identical UTC date', () => {
  const c1 = getDailyChallenge('2026-11-16');
  const c2 = getDailyChallenge('2026-11-16');
  expect(c1.code).toBe(c2.code);
  expect(c1.missionNumber).toBe(c2.missionNumber);
  expect(c1.code.length).toBe(5);
  expect(/^[A-Z]{5}$/.test(c1.code)).toBe(true);
});

it('generates 5-letter practice passwords with letters A-Z', () => {
  for (let i = 0; i < 50; i++) {
    const code = generatePracticeCode();
    expect(code.length).toBe(5);
    expect(/^[A-Z]{5}$/.test(code)).toBe(true);
  }
});

// 4. SCORING ENGINE
it('awards higher score for fewer attempts and fast time', () => {
  const score1 = calculateScore({ attempts: 2, elapsedSeconds: 40, streak: 3 });
  const score6 = calculateScore({ attempts: 6, elapsedSeconds: 220, streak: 0 });
  expect(score1.totalScore).toBeGreaterThan(score6.totalScore);
});

it('updates streaks and distribution correctly', () => {
  let stats = INITIAL_STATS;
  stats = recordGameStats(stats, { won: true, attempts: 3, elapsedSeconds: 65, date: '2026-11-15' });
  expect(stats.gamesPlayed).toBe(1);
  expect(stats.gamesWon).toBe(1);
  expect(stats.currentStreak).toBe(1);
  expect(stats.guessDistribution[3]).toBe(1);

  // A loss resets streak
  stats = recordGameStats(stats, { won: false, attempts: 6, elapsedSeconds: 120, date: '2026-11-17' });
  expect(stats.currentStreak).toBe(0);
  expect(stats.gamesPlayed).toBe(2);
});

// 5. DATE UTILITIES & 24-HR CYCLE
it('computes correct duration string', () => {
  expect(formatDuration(0)).toBe('00:00');
  expect(formatDuration(85)).toBe('01:25');
});

it('calculates 24-hr next midnight timer', () => {
  const cd = getTimeUntilNextUtcMidnight();
  expect(cd.totalSeconds).toBeGreaterThan(0);
  expect(cd.formatted.length).toBe(8); // 'HH:MM:SS'
});

console.log(`\n========================================`);
console.log(`ALL ${testsPassed} TESTS PASSED WITH 100% SUCCESS!`);
console.log(`========================================\n`);
