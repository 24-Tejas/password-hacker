/**
 * PASSWORD HACKER - Password Generator
 * Generates deterministic daily 5-letter passwords and random practice words.
 * All passwords are composed strictly of uppercase letters A-Z.
 */

import { PASSWORD_WORDS } from './words.js';
import { getUtcDateString, getMissionNumber } from '../utils/dateUtils.js';

/**
 * 32-bit FNV-1a hash function for strings.
 * @param {string} str
 * @returns {number} 32-bit unsigned integer
 */
function fnv1a(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * Mulberry32 pseudo-random number generator.
 * @param {number} seed - 32-bit seed
 * @returns {() => number}
 */
function createMulberry32(seed) {
  let state = seed >>> 0;
  return function () {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministically generates a 5-letter password for a given UTC date.
 *
 * @param {string} [utcDateString] - 'YYYY-MM-DD', defaults to today's UTC
 * @returns {{ code: string, date: string, missionNumber: number }}
 */
export function getDailyChallenge(utcDateString = getUtcDateString()) {
  const seedString = `PASSWORD_HACKER_WORD_SEED_${utcDateString}`;
  const seed = fnv1a(seedString);
  const rng = createMulberry32(seed);

  const wordIndex = Math.floor(rng() * PASSWORD_WORDS.length);
  const code = PASSWORD_WORDS[wordIndex];
  const missionNumber = getMissionNumber(utcDateString);

  return {
    code,
    date: utcDateString,
    missionNumber,
  };
}

/**
 * Generates a random 5-letter password for Practice Mode.
 *
 * @returns {string} 5-letter word
 */
export function generatePracticeCode() {
  const index = Math.floor(Math.random() * PASSWORD_WORDS.length);
  return PASSWORD_WORDS[index];
}
