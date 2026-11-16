/**
 * PASSWORD HACKER - Scoring and Rating Engine
 * Computes hacker scores based on attempts, elapsed time, and streak multipliers.
 */

export const INITIAL_STATS = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  longestStreak: 0,
  guessDistribution: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  },
  bestTimeSeconds: null,
  totalAttemptsInWins: 0,
  lastPlayedDate: null,
  lastWonDate: null,
};

/**
 * Calculates a player's score for a completed game.
 *
 * @param {object} params
 * @param {number} params.attempts - Number of attempts used (1 to 6)
 * @param {number} params.elapsedSeconds - Total time elapsed in seconds
 * @param {number} [params.streak=0] - Current winning streak
 * @returns {{
 *   totalScore: number,
 *   basePoints: number,
 *   attemptBonus: number,
 *   speedBonus: number,
 *   streakMultiplier: number,
 *   rankTitle: string,
 *   grade: string
 * }}
 */
export function calculateScore({ attempts, elapsedSeconds, streak = 0 }) {
  const basePoints = 5000;

  // Attempt bonuses
  const attemptBonuses = {
    1: 5000,
    2: 4000,
    3: 3000,
    4: 2000,
    5: 1000,
    6: 500,
  };
  const attemptBonus = attemptBonuses[attempts] || 500;

  // Speed bonus (par is 180 seconds / 3 minutes)
  const parTime = 180;
  const speedBonus = elapsedSeconds < parTime
    ? Math.max(0, Math.floor((parTime - elapsedSeconds) * 20))
    : 0;

  // Streak multiplier (up to +50% for 10-day streak)
  const streakBonusPct = Math.min(0.5, streak * 0.05);
  const streakMultiplier = 1 + streakBonusPct;

  const rawScore = (basePoints + attemptBonus + speedBonus) * streakMultiplier;
  const totalScore = Math.round(rawScore);

  let rankTitle = 'SCRIPT INITIATE';
  let grade = 'D';

  if (totalScore >= 11000) {
    rankTitle = 'GHOST IN THE SHELL // S+ ELITE';
    grade = 'S+';
  } else if (totalScore >= 9500) {
    rankTitle = 'CIPHER OVERLORD // S-RANK';
    grade = 'S';
  } else if (totalScore >= 8000) {
    rankTitle = 'ROOT ACCESS MASTER // A-RANK';
    grade = 'A';
  } else if (totalScore >= 6500) {
    rankTitle = 'NETWORK INTRUDER // B-RANK';
    grade = 'B';
  } else if (totalScore >= 5500) {
    rankTitle = 'PACKET INTERCEPTOR // C-RANK';
    grade = 'C';
  }

  return {
    totalScore,
    basePoints,
    attemptBonus,
    speedBonus,
    streakMultiplier: Number(streakMultiplier.toFixed(2)),
    rankTitle,
    grade,
  };
}

/**
 * Updates statistics state after a game finishes.
 *
 * @param {typeof INITIAL_STATS} currentStats
 * @param {object} gameResult
 * @param {boolean} gameResult.won
 * @param {number} gameResult.attempts
 * @param {number} gameResult.elapsedSeconds
 * @param {string} gameResult.date - UTC date string
 * @returns {typeof INITIAL_STATS}
 */
export function recordGameStats(currentStats, { won, attempts, elapsedSeconds, date }) {
  const stats = {
    ...INITIAL_STATS,
    ...currentStats,
    guessDistribution: {
      ...INITIAL_STATS.guessDistribution,
      ...(currentStats.guessDistribution || {}),
    },
  };

  stats.gamesPlayed += 1;
  stats.lastPlayedDate = date;

  if (won) {
    stats.gamesWon += 1;
    stats.totalAttemptsInWins += attempts;

    // Check streak continuation:
    // If lastWonDate was yesterday in UTC, increment streak; otherwise reset to 1
    if (stats.lastWonDate) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (stats.lastWonDate === yesterday || stats.lastWonDate === date) {
        stats.currentStreak += 1;
      } else {
        stats.currentStreak = 1;
      }
    } else {
      stats.currentStreak = 1;
    }

    if (stats.currentStreak > stats.longestStreak) {
      stats.longestStreak = stats.currentStreak;
    }

    stats.lastWonDate = date;

    // Record guess distribution
    if (attempts >= 1 && attempts <= 6) {
      stats.guessDistribution[attempts] = (stats.guessDistribution[attempts] || 0) + 1;
    }

    // Best time
    if (stats.bestTimeSeconds === null || elapsedSeconds < stats.bestTimeSeconds) {
      stats.bestTimeSeconds = elapsedSeconds;
    }
  } else {
    // Loss resets current streak
    stats.currentStreak = 0;
  }

  return stats;
}

/**
 * Calculates win percentage and average attempts.
 * @param {typeof INITIAL_STATS} stats
 * @returns {{ winPercentage: number, averageAttempts: string }}
 */
export function getDerivedStats(stats) {
  const winPercentage = stats.gamesPlayed > 0
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    : 0;

  const averageAttempts = stats.gamesWon > 0
    ? (stats.totalAttemptsInWins / stats.gamesWon).toFixed(1)
    : '0.0';

  return {
    winPercentage,
    averageAttempts,
  };
}
