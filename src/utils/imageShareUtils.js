/**
 * PASSWORD CRACKER - Canvas Image Share Generator
 * Creates a high-resolution PNG image of the player's full decryption steps,
 * words guessed, feedback tile colors, target password, and telemetry stats.
 */

import { formatDuration } from './dateUtils.js';

const TILE_COLORS = {
  correct: '#538d4e',
  misplaced: '#b59f3b',
  wrong: '#787c7e',
  empty: '#e2e8f0',
};

/**
 * Draws a rounded rectangle on a 2D canvas context.
 */
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

/**
 * Generates an image Blob and DataURL representing the game results.
 *
 * @param {object} params
 * @param {string} params.mode - 'DAILY' | 'PRACTICE'
 * @param {string|number} params.missionTag - e.g. "#685"
 * @param {boolean} params.won
 * @param {number} params.attempts
 * @param {number} params.maxAttempts
 * @param {string[]} params.guesses - Array of 5-letter guesses typed by the user
 * @param {Array<Array<'correct'|'misplaced'|'wrong'>>} params.evaluations - Feedback array
 * @param {string} params.secret - Target password
 * @param {number} params.elapsedSeconds
 * @returns {Promise<{ blob: Blob, dataUrl: string, file: File }>}
 */
export async function generateResultImage({
  mode,
  missionTag,
  won,
  attempts,
  maxAttempts = 6,
  guesses = [],
  evaluations = [],
  secret = '',
  elapsedSeconds = 0,
}) {
  const width = 640;
  const numRows = Math.max(1, guesses.length);
  const tileSize = 58;
  const tileGap = 8;
  const gridWidth = 5 * tileSize + 4 * tileGap;
  const gridHeight = numRows * tileSize + (numRows - 1) * tileGap;

  const headerHeight = 150;
  const footerHeight = 130;
  const height = headerHeight + gridHeight + footerHeight;

  const canvas = document.createElement('canvas');
  canvas.width = width * 2; // 2x retina scale
  canvas.height = height * 2;
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);

  // 1. Background
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, width, height);

  // Background card border & shadow
  roundRect(ctx, 16, 16, width - 32, height - 32, 16);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#e2e8f0';
  ctx.stroke();

  // 2. Header
  // Logo & Title
  ctx.textAlign = 'center';
  ctx.font = '800 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#1e293b';
  ctx.fillText('🔐 PASSWORD CRACKER', width / 2, 60);

  // Mode & Tag
  ctx.font = '700 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#0284c7';
  const tagText = mode === 'DAILY' ? `DAILY CHALLENGE ${missionTag}` : `PRACTICE SIMULATION ${missionTag}`;
  ctx.fillText(tagText, width / 2, 85);

  // Outcome banner
  ctx.font = '800 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  if (won) {
    ctx.fillStyle = '#16a34a';
    ctx.fillText(`🎉 PASSWORD CRACKED IN ${attempts}/${maxAttempts} ATTEMPTS (${formatDuration(elapsedSeconds)})`, width / 2, 115);
  } else {
    ctx.fillStyle = '#dc2626';
    ctx.fillText(`ATTEMPTS EXHAUSTED (${maxAttempts}/${maxAttempts})`, width / 2, 115);
  }

  // 3. Grid of Evaluated Word Steps
  const gridStartX = (width - gridWidth) / 2;
  const gridStartY = headerHeight;

  for (let r = 0; r < numRows; r++) {
    const word = (guesses[r] || '').toUpperCase();
    const rowEval = evaluations[r] || [];
    const rowY = gridStartY + r * (tileSize + tileGap);

    for (let c = 0; c < 5; c++) {
      const char = word[c] || '';
      const status = rowEval[c] || 'wrong';
      const tileX = gridStartX + c * (tileSize + tileGap);
      const bg = TILE_COLORS[status] || TILE_COLORS.wrong;

      // Draw tile background
      roundRect(ctx, tileX, rowY, tileSize, tileSize, 6);
      ctx.fillStyle = bg;
      ctx.fill();

      // Draw character
      if (char) {
        ctx.font = '800 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(char, tileX + tileSize / 2, rowY + tileSize / 2 + 1);
      }
    }
  }

  // 4. Footer
  const footerY = gridStartY + gridHeight + 36;

  // Target Password Box
  roundRect(ctx, width / 2 - 130, footerY - 10, 260, 42, 8);
  ctx.fillStyle = '#f1f5f9';
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#cbd5e1';
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('TARGET PASSWORD:', width / 2 - 45, footerY + 11);

  ctx.font = '800 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = won ? '#16a34a' : '#dc2626';
  ctx.fillText(secret.toUpperCase(), width / 2 + 55, footerY + 11);

  // Footer Branding
  ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('DECRYPTED WITH PASSWORD CRACKER • NEXT AT 12:00 AM', width / 2, footerY + 54);

  // Convert canvas to Blob
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const dataUrl = canvas.toDataURL('image/png');
      const file = new File([blob], `password-cracker-${missionTag}.png`, {
        type: 'image/png',
      });
      resolve({ blob, dataUrl, file });
    }, 'image/png');
  });
}
