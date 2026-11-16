/**
 * Date and time utility functions for PASSWORD HACKER.
 * Uses strict UTC dates for determinism across timezones.
 */

// Global epoch for mission indexing (Jan 1, 2025 UTC)
export const EPOCH_DATE = new Date(Date.UTC(2025, 0, 1));

/**
 * Returns the current date in UTC as 'YYYY-MM-DD'.
 * @param {Date} [date=new Date()]
 * @returns {string} e.g. "2026-11-16"
 */
export function getUtcDateString(date = new Date()) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates mission index based on UTC days elapsed since epoch.
 * @param {string} utcDateString - 'YYYY-MM-DD'
 * @returns {number} 1-based mission index
 */
export function getMissionNumber(utcDateString) {
  const [year, month, day] = utcDateString.split('-').map(Number);
  const targetDate = new Date(Date.UTC(year, month - 1, day));
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
 * Calculates the exact remaining time until the next UTC midnight.
 * @returns {{ hours: number, minutes: number, seconds: number, formatted: string, totalSeconds: number }}
 */
export function getTimeUntilNextUtcMidnight() {
  const now = new Date();
  const nextMidnight = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0, 0, 0, 0
    )
  );

  const diffMs = Math.max(0, nextMidnight.getTime() - now.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return { hours, minutes, seconds, formatted, totalSeconds };
}

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
 * Human-friendly UTC date string e.g. "16 NOV 2026"
 * @param {string} utcDateString - 'YYYY-MM-DD'
 * @returns {string}
 */
export function formatDisplayDate(utcDateString) {
  if (!utcDateString) return '';
  const [year, month, day] = utcDateString.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return `${day} ${months[date.getUTCMonth()]} ${year}`;
}
