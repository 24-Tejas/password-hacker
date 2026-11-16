/**
 * PASSWORD HACKER - Share Utilities
 * Formats Wordle-style emoji grids and handles Web Share API / clipboard fallbacks.
 */

import { formatDuration } from './dateUtils.js';

const EMOJI_MAP = {
  correct: '🟩',
  misplaced: '🟨',
  wrong: '⬛',
};

/**
 * Generates the shareable result text.
 *
 * @param {object} params
 * @param {boolean} params.isDaily
 * @param {number|string} params.missionTag - e.g. "#042" or "PRAC-72"
 * @param {boolean} params.won
 * @param {number} params.attempts
 * @param {number} params.maxAttempts
 * @param {Array<Array<'correct'|'misplaced'|'wrong'>>} params.evaluations
 * @param {number} params.elapsedSeconds
 * @param {number} [params.score]
 * @returns {string}
 */
export function generateShareText({
  isDaily,
  missionTag,
  won,
  attempts,
  maxAttempts = 6,
  evaluations = [],
  elapsedSeconds,
  score,
}) {
  const title = isDaily
    ? `PASSWORD HACKER ${missionTag}`
    : `PASSWORD HACKER [PRACTICE ${missionTag}]`;

  const statusLine = won
    ? `Security Breached in ${attempts}/${maxAttempts} attempts (${formatDuration(elapsedSeconds)})`
    : `Breach Aborted (${maxAttempts}/${maxAttempts} attempts exhausted)`;

  const scoreLine = won && score ? `Hack Score: ${score.toLocaleString()} PTS` : '';

  // Generate grid rows
  const gridLines = evaluations
    .map((row) => row.map((status) => EMOJI_MAP[status] || '⬛').join(''))
    .join('\n');

  const shareParts = [title, statusLine];
  if (scoreLine) shareParts.push(scoreLine);
  shareParts.push('', gridLines);

  return shareParts.join('\n');
}

/**
 * Copies plain text to clipboard with modern and fallback methods.
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to textarea execCommand fallback
    }
  }

  // Fallback for older browsers or non-HTTPS contexts
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}

/**
 * Shares the game results using Web Share API or falls back to clipboard.
 *
 * @param {object} gameData - Params for generateShareText
 * @returns {Promise<{ success: boolean, method: 'share' | 'clipboard' | 'none' }>}
 */
export async function shareGameResult(gameData) {
  const shareText = generateShareText(gameData);

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: 'PASSWORD HACKER',
        text: shareText,
      });
      return { success: true, method: 'share' };
    } catch (err) {
      if (err.name === 'AbortError') {
        // User cancelled share dialog, not an error
        return { success: false, method: 'none' };
      }
      // If native share threw other error, try clipboard fallback
    }
  }

  const copied = await copyToClipboard(shareText);
  return { success: copied, method: copied ? 'clipboard' : 'none' };
}
