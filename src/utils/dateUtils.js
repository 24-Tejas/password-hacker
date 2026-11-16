/**
 * Date and time utility functions for PASSWORD HACKER.
 * Configured for 12:00 AM (Midnight) local puzzle resets and countdowns.
 */

// Global epoch for mission indexing (Jan 1, 2025)
export const EPOCH_DATE = new Date(2025, 0, 1);

/**
 * Returns the current local calendar date as 'YYYY-MM-DD'.
 * Rolls over at local 12:00 AM midnight.
 * @param {Date} [date=new Date()]
 * @returns {string} e.g. "2026-11-16"
 */
export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Alias for backwards compatibility with any existing imports
export const getUtcDateString = getLocalDateString;

/**
 * Calculates mission index based on days elapsed since epoch.
 * @param {string} dateString - 'YYYY-MM-DD'
 * @returns {number} 1-based mission index
 */
export function getMissionNumber(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  const diffTime = targetDate.getTime() - EPOCH_DATE.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1);
}

/**
 * Formats mission number with zero-padding (e.g. "#042").
 * @param {number} missionNum
 * @returns {string}
 */
export function formatMissionTag(missionNum) {
  return `#${String(missionNum).padStart(3, '0')}`;
}

/**
 * Calculates the exact remaining time until tonight's 12:00 AM midnight.
 * Automatically resets to the next day when 12:00 AM strikes.
 * @param {Date} [now=new Date()]
 * @returns {{ hours: number, minutes: number, seconds: number, formatted: string, totalSeconds: number }}
 */
export function getTimeUntilNextMidnight(now = new Date()) {
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0, 0, 0, 0
  );

  const diffMs = Math.max(0, nextMidnight.getTime() - now.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return { hours, minutes, seconds, formatted, totalSeconds };
}

// Alias for backwards compatibility
export const getTimeUntilNextUtcMidnight = getTimeUntilNextMidnight;

/**
 * Formats a duration in seconds to mm:ss format.
 * @param {number} totalSeconds
 * @returns {string}
 */
export function formatDuration(totalSeconds) {
  if (typeof totalSeconds !== 'number' || isNaN(totalSeconds) || totalSeconds < 0) {
    return '00:00';
  }
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Human-friendly date string e.g. "16 NOV 2026"
 * @param {string} dateString - 'YYYY-MM-DD'
 * @returns {string}
 */
export function formatDisplayDate(dateString) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return `${day} ${months[date.getMonth()]} ${year}`;
}
