/**
 * PASSWORD CRACKER - Share Utilities
 * Formats Wordle-style text/emoji grids, handles Web Share API with images and clipboard fallbacks.
 */

import { formatDuration } from './dateUtils.js';

const EMOJI_MAP = {
  correct: '🟩',
  misplaced: '🟨',
  wrong: '⬛',
};

/**
 * Generates the shareable result text.
 */
export function generateShareText({
  isDaily,
  missionTag,
  won,
  attempts,
  maxAttempts = 6,
  evaluations = [],
  elapsedSeconds,
}) {
  const title = isDaily
    ? `PASSWORD CRACKER ${missionTag}`
    : `PASSWORD CRACKER [PRACTICE ${missionTag}]`;

  const statusLine = won
    ? `Cracked in ${attempts}/${maxAttempts} attempts (${formatDuration(elapsedSeconds)})`
    : `Attempts exhausted (${maxAttempts}/${maxAttempts})`;

  // Generate grid rows
  const gridLines = evaluations
    .map((row) => row.map((status) => EMOJI_MAP[status] || '⬛').join(''))
    .join('\n');

  const shareParts = [title, statusLine, '', gridLines];
  return shareParts.join('\n');
}

/**
 * Copies plain text to clipboard.
 */
export async function copyToClipboard(text) {
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {}
  }

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
 * Triggers direct browser download of a dataURL image.
 */
export function downloadImage(dataUrl, filename = 'password-cracker-result.png') {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Shares the game results image via Web Share API or downloads it.
 */
export async function shareImageResult(file, dataUrl, text = '') {
  // If native Web Share supports files (e.g. mobile Chrome/Safari)
  if (
    typeof navigator !== 'undefined' &&
    navigator.canShare &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({
        title: 'PASSWORD CRACKER',
        text: text || 'Can you crack today’s password? Play at PASSWORD CRACKER!',
        files: [file],
      });
      return { success: true, method: 'share' };
    } catch (err) {
      if (err.name === 'AbortError') {
        return { success: false, method: 'none' };
      }
    }
  }

  // Fallback: download the image directly and copy text
  downloadImage(dataUrl, file.name);
  if (text) {
    await copyToClipboard(text);
  }
  return { success: true, method: 'download' };
}
