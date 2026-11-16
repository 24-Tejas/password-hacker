/**
 * PASSWORD HACKER - Core Game Engine
 * Pure state transformations and keyboard state reductions.
 */

import {
  evaluateGuess,
  validateGuess,
  isWinningFeedback,
  MAX_ATTEMPTS,
  STATUS,
} from './feedback.js';

export const GAME_STATUS = {
  IN_PROGRESS: 'IN_PROGRESS',
  WON: 'WON',
  LOST: 'LOST',
};

/**
 * Computes the aggregated keyboard status map.
 * Precedence: 'correct' (green) > 'misplaced' (yellow) > 'wrong' (grey)
 *
 * @param {string[]} guesses
 * @param {Array<Array<'correct'|'misplaced'|'wrong'>>} evaluations
 * @returns {Record<string, 'correct'|'misplaced'|'wrong'>}
 */
export function buildKeyboardStatus(guesses, evaluations) {
  const keyboard = {};

  const priority = {
    [STATUS.CORRECT]: 3,
    [STATUS.MISPLACED]: 2,
    [STATUS.WRONG]: 1,
  };

  guesses.forEach((guess, r) => {
    const evalRow = evaluations[r];
    if (!evalRow) return;

    for (let c = 0; c < guess.length; c++) {
      const char = guess[c];
      const status = evalRow[c];
      const currentStatus = keyboard[char];

      if (!currentStatus || (priority[status] || 0) > (priority[currentStatus] || 0)) {
        keyboard[char] = status;
      }
    }
  });

  return keyboard;
}

/**
 * Creates a fresh blank game state.
 *
 * @param {string} secret
 * @param {number} missionNumber
 * @param {string} mode - 'DAILY' | 'PRACTICE'
 * @returns {object}
 */
export function createInitialGameState(secret, missionNumber, mode = 'DAILY') {
  return {
    mode,
    secret,
    missionNumber,
    guesses: [],
    evaluations: [],
    currentDraft: '',
    status: GAME_STATUS.IN_PROGRESS,
    elapsedSeconds: 0,
    startedAt: Date.now(),
    completedAt: null,
  };
}

/**
 * Processes a guess submission.
 *
 * @param {object} state - Current game state
 * @returns {{
 *   success: boolean,
 *   nextState?: object,
 *   error?: string,
 *   feedbackRow?: Array<'correct'|'misplaced'|'wrong'>,
 *   won?: boolean,
 *   lost?: boolean
 * }}
 */
export function processGuessSubmission(state) {
  if (state.status !== GAME_STATUS.IN_PROGRESS) {
    return { success: false, error: 'SESSION CONCLUDED: Further attempts locked.' };
  }

  if (state.guesses.length >= MAX_ATTEMPTS) {
    return { success: false, error: 'SECURITY LOCKOUT: Max attempts exceeded.' };
  }

  const validation = validateGuess(state.currentDraft, state.guesses);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const guess = state.currentDraft.toUpperCase();
  const feedback = evaluateGuess(guess, state.secret);
  const won = isWinningFeedback(feedback);
  const nextGuesses = [...state.guesses, guess];
  const nextEvaluations = [...state.evaluations, feedback];

  let nextStatus = GAME_STATUS.IN_PROGRESS;
  let completedAt = null;

  if (won) {
    nextStatus = GAME_STATUS.WON;
    completedAt = Date.now();
  } else if (nextGuesses.length >= MAX_ATTEMPTS) {
    nextStatus = GAME_STATUS.LOST;
    completedAt = Date.now();
  }

  return {
    success: true,
    won,
    lost: nextStatus === GAME_STATUS.LOST,
    feedbackRow: feedback,
    nextState: {
      ...state,
      guesses: nextGuesses,
      evaluations: nextEvaluations,
      currentDraft: '',
      status: nextStatus,
      completedAt,
    },
  };
}
