/**
 * Custom hook for safe localStorage persistence.
 * Resilient against missing keys, quota limits, private mode, and JSON corruption.
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * @template T
 * @param {string} key - localStorage key
 * @param {T} initialValue - Fallback default value
 * @returns {[T, (val: T | ((prev: T) => T)) => void]}
 */
export function useLocalStorage(key, initialValue) {
  const readValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return initialValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.warn(`[PASSWORD HACKER] Corrupted or inaccessible localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState(readValue);

  const setValue = useCallback(
    (value) => {
      try {
        setStoredValue((prev) => {
          const valueToStore = value instanceof Function ? value(prev) : value;
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }
          return valueToStore;
        });
      } catch (error) {
        console.warn(`[PASSWORD HACKER] Error writing to localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  // Sync state if another tab modifies it
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {
          // ignore corrupted cross-tab payload
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
