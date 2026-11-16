/**
 * PASSWORD HACKER - Feedback Algorithm
 * Pure, independently testable game evaluation functions for 5-letter passwords.
 * Mirrors Wordle feedback rules with uppercase A-Z alphabet.
 */

export const CODE_LENGTH = 5;
export const MAX_ATTEMPTS = 6;
export const VALID_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const VALID_CHAR_SET = new Set(VALID_CHARACTERS.split(''));

/**
 * Feedback status enum:
 * - 'correct': Correct letter in the correct position (Green)
 * - 'misplaced': Correct letter in the wrong position (Yellow)
 * - 'wrong': Letter does not exist in the secret code (Grey)
 */
export const STATUS = {
  CORRECT: 'correct',
  MISPLACED: 'misplaced',
  WRONG: 'wrong',
};

/**
 * Evaluates a 5-letter guess against the secret password.
 * Implements the standard two-pass Wordle algorithm handling letter frequencies.
 *
 * @param {string} guess - The player's 5-letter guess (uppercase)
 * @param {string} secret - The 5-letter secret password (uppercase)
 * @returns {Array<'correct' | 'misplaced' | 'wrong'>} Feedback array of length 5
 */
export function evaluateGuess(guess, secret) {
  if (typeof guess !== 'string' || typeof secret !== 'string') {
    throw new Error('Both guess and secret must be strings');
  }

  const cleanGuess = guess.toUpperCase().trim();
  const cleanSecret = secret.toUpperCase().trim();

  if (cleanGuess.length !== CODE_LENGTH || cleanSecret.length !== CODE_LENGTH) {
    throw new Error(`Guess and secret must both be exactly ${CODE_LENGTH} letters`);
  }

  const feedback = new Array(CODE_LENGTH).fill(STATUS.WRONG);
  const secretChars = cleanSecret.split('');
  const guessChars = cleanGuess.split('');

  // Keep track of available letters for yellow / misplaced matches
  const availableSecret = [];

  // Pass 1: Identify exact position matches (Green / correct)
  for (let i = 0; i < CODE_LENGTH; i++) {
    if (guessChars[i] === secretChars[i]) {
      feedback[i] = STATUS.CORRECT;
    } else {
      availableSecret.push(secretChars[i]);
    }
  }

  // Pass 2: Identify misplaced matches (Yellow / misplaced)
  for (let i = 0; i < CODE_LENGTH; i++) {
    if (feedback[i] === STATUS.CORRECT) {
      continue;
    }

    const char = guessChars[i];
    const matchIdx = availableSecret.indexOf(char);
    if (matchIdx !== -1) {
      feedback[i] = STATUS.MISPLACED;
      availableSecret.splice(matchIdx, 1);
    }
  }

  return feedback;
}

/**
 * Validates whether a candidate guess is legal before submission.
 *
 * @param {string} guess - Candidate guess string
 * @param {string[]} [existingGuesses=[]] - Already submitted guesses
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateGuess(guess, existingGuesses = []) {
  if (!guess || typeof guess !== 'string') {
    return { valid: false, error: 'PASSWORD INCOMPLETE: Enter 5 letters.' };
  }

  const normalized = guess.toUpperCase().trim();

  if (normalized.length < CODE_LENGTH) {
    return {
      valid: false,
      error: `TOO SHORT: Needs ${CODE_LENGTH} letters (entered ${normalized.length}).`,
    };
  }

  if (normalized.length > CODE_LENGTH) {
    return {
      valid: false,
      error: `TOO LONG: Exactly ${CODE_LENGTH} letters allowed.`,
    };
  }

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    if (!VALID_CHAR_SET.has(char)) {
      return {
        valid: false,
        error: `INVALID CHARACTER '${char}': Use letters A–Z only.`,
      };
    }
  }

  // Check if previously attempted
  const alreadyAttempted = existingGuesses.some(
    (g) => g.toUpperCase().trim() === normalized
  );
  if (alreadyAttempted) {
    return {
      valid: false,
      error: 'REPEAT GUESS: Password already tried.',
    };
  }

  return { valid: true };
}

/**
 * Checks whether an incoming letter is valid to add to the current draft.
 *
 * @param {string} char - Single letter
 * @param {string} currentDraft - Current unsubmitted draft
 * @returns {{ allowed: boolean, reason?: string }}
 */
export function canAppendChar(char, currentDraft) {
  if (currentDraft.length >= CODE_LENGTH) {
    return { allowed: false, reason: `Word buffer full (${CODE_LENGTH}/${CODE_LENGTH})` };
  }

  const upper = char.toUpperCase();
  if (!VALID_CHAR_SET.has(upper)) {
    return { allowed: false, reason: `Letters A–Z only (received '${char}')` };
  }

  return { allowed: true };
}

/**
 * Check if the feedback represents a complete win.
 * @param {Array<'correct' | 'misplaced' | 'wrong'>} feedback
 * @returns {boolean}
 */
export function isWinningFeedback(feedback) {
  return (
    Array.isArray(feedback) &&
    feedback.length === CODE_LENGTH &&
    feedback.every((status) => status === STATUS.CORRECT)
  );
}
