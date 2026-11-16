/**
 * PASSWORD HACKER - Main Game Hook
 * Coordinates game state, persistence, daily/practice modes, animations, sound, and terminal logs.
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage.js';
import {
  CODE_LENGTH,
  MAX_ATTEMPTS,
  canAppendChar,
  validateGuess,
  STATUS,
} from '../game/feedback.js';
import {
  createInitialGameState,
  processGuessSubmission,
  buildKeyboardStatus,
  GAME_STATUS,
} from '../game/gameEngine.js';
import { getDailyChallenge, generatePracticeCode } from '../game/dailyGenerator.js';
import {
  INITIAL_STATS,
  recordGameStats,
  calculateScore,
} from '../game/scoring.js';
import { sound } from '../game/soundEngine.js';
import { getUtcDateString } from '../utils/dateUtils.js';
import confetti from 'canvas-confetti';

const STORAGE_KEYS = {
  DAILY_STATE: 'pw_hacker_daily_state_v1',
  DAILY_STATS: 'pw_hacker_daily_stats_v1',
  PRACTICE_STATE: 'pw_hacker_practice_state_v1',
  PRACTICE_STATS: 'pw_hacker_practice_stats_v1',
  SETTINGS: 'pw_hacker_settings_v1',
};

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  crtScanlines: true,
  animationsEnabled: true,
};

export function useGame() {
  const [mode, setMode] = useState('DAILY'); // 'DAILY' | 'PRACTICE'
  const [toastMessage, setToastMessage] = useState(null);
  const [isShaking, setIsShaking] = useState(false);
  const [revealingRowIndex, setRevealingRowIndex] = useState(-1);
  const [revealedCellCount, setRevealedCellCount] = useState(CODE_LENGTH); // for animation step
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  // Settings
  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);

  // Keep sound engine in sync with settings
  useEffect(() => {
    sound.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Daily Stats & Practice Stats
  const [dailyStats, setDailyStats] = useLocalStorage(STORAGE_KEYS.DAILY_STATS, INITIAL_STATS);
  const [practiceStats, setPracticeStats] = useLocalStorage(STORAGE_KEYS.PRACTICE_STATS, INITIAL_STATS);

  // Terminal Log messages
  const [logs, setLogs] = useState([]);

  const addLog = useCallback((text, type = 'info') => {
    const timeStr = new Date().toISOString().slice(11, 19);
    setLogs((prev) => [
      ...prev.slice(-40), // keep last 40 entries
      {
        id: Math.random().toString(36).slice(2, 9),
        time: timeStr,
        text,
        type,
      },
    ]);
  }, []);

  // Today's UTC Date and Daily Challenge
  const currentUtcDate = getUtcDateString();
  const dailyChallenge = useMemo(() => getDailyChallenge(currentUtcDate), [currentUtcDate]);

  // Persisted Daily Game State
  const [storedDailyGame, setStoredDailyGame] = useLocalStorage(
    `${STORAGE_KEYS.DAILY_STATE}_${currentUtcDate}`,
    null
  );

  // Persisted Practice Game State
  const [storedPracticeGame, setStoredPracticeGame] = useLocalStorage(
    STORAGE_KEYS.PRACTICE_STATE,
    null
  );

  // Current active game state object
  const [gameState, setGameState] = useState(() => {
    if (storedDailyGame && storedDailyGame.date === currentUtcDate) {
      return storedDailyGame;
    }
    return {
      ...createInitialGameState(dailyChallenge.code, dailyChallenge.missionNumber, 'DAILY'),
      date: currentUtcDate,
    };
  });

  // Keep track of whether initial mount log was generated
  const mountedRef = useRef(false);

  // Initialize or restore Daily game when switching to DAILY or on date roll
  const initDailyGame = useCallback(() => {
    if (storedDailyGame && storedDailyGame.date === currentUtcDate) {
      setGameState(storedDailyGame);
      addLog(`RESTORED DAILY MISSION #${storedDailyGame.missionNumber} // UTC [${currentUtcDate}]`, 'info');
      if (storedDailyGame.status !== GAME_STATUS.IN_PROGRESS) {
        setIsResultOpen(true);
      }
    } else {
      const freshDaily = {
        ...createInitialGameState(dailyChallenge.code, dailyChallenge.missionNumber, 'DAILY'),
        date: currentUtcDate,
      };
      setGameState(freshDaily);
      setStoredDailyGame(freshDaily);
      addLog(`INITIALIZED DAILY PROTOCOL #${dailyChallenge.missionNumber} // TARGET LOCKED`, 'info');
    }
  }, [storedDailyGame, currentUtcDate, dailyChallenge, addLog, setStoredDailyGame]);

  // Initialize or restore Practice game
  const initPracticeGame = useCallback((forceNew = false) => {
    if (!forceNew && storedPracticeGame && storedPracticeGame.status === GAME_STATUS.IN_PROGRESS) {
      setGameState(storedPracticeGame);
      addLog(`RESTORED PRACTICE PROTOCOL #${storedPracticeGame.missionNumber}`, 'info');
    } else {
      const code = generatePracticeCode();
      const missionNumber = Math.floor(100 + Math.random() * 900);
      const freshPractice = {
        ...createInitialGameState(code, missionNumber, 'PRACTICE'),
        date: currentUtcDate,
      };
      setGameState(freshPractice);
      setStoredPracticeGame(freshPractice);
      addLog(`NEW SIMULATED TARGET #${missionNumber} GENERATED // NO IMPACT ON DAILY STREAK`, 'info');
    }
  }, [storedPracticeGame, currentUtcDate, addLog, setStoredPracticeGame]);

  // Switch Modes
  const handleSwitchMode = useCallback((newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    if (newMode === 'DAILY') {
      initDailyGame();
    } else {
      initPracticeGame(false);
    }
  }, [mode, initDailyGame, initPracticeGame]);

  // Initial mount setup
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      initDailyGame();
      addLog('CIPHER BREACH TERMINAL READY. ENTER 5-LETTER PASSWORD.', 'success');
    }
  }, [initDailyGame, addLog]);

  // 12:00 AM Midnight Rollover Watcher: auto-unlocks new daily password after midnight
  useEffect(() => {
    const midnightInterval = setInterval(() => {
      const today = getUtcDateString();
      if (today !== currentUtcDate) {
        window.location.reload();
      }
    }, 5000);
    return () => clearInterval(midnightInterval);
  }, [currentUtcDate]);

  // Sync gameState back to localStorage
  useEffect(() => {
    if (gameState.mode === 'DAILY') {
      setStoredDailyGame(gameState);
    } else {
      setStoredPracticeGame(gameState);
    }
  }, [gameState, setStoredDailyGame, setStoredPracticeGame]);

  // Timer: begins ticking only after entering the first word
  useEffect(() => {
    if (gameState.status !== GAME_STATUS.IN_PROGRESS) return;
    if (gameState.guesses.length === 0) return; // Wait until first word is entered

    const timer = setInterval(() => {
      setGameState((prev) => {
        if (prev.status !== GAME_STATUS.IN_PROGRESS || prev.guesses.length === 0) return prev;
        return {
          ...prev,
          elapsedSeconds: (prev.elapsedSeconds || 0) + 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.status, gameState.guesses.length]);

  // Toast trigger helper
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
  }, []);

  // Keyboard aggregate map
  const keyboardStatus = useMemo(() => {
    return buildKeyboardStatus(gameState.guesses, gameState.evaluations);
  }, [gameState.guesses, gameState.evaluations]);

  // Character typing
  const handleTypeChar = useCallback((char) => {
    if (gameState.status !== GAME_STATUS.IN_PROGRESS || revealingRowIndex !== -1) {
      return;
    }

    const check = canAppendChar(char, gameState.currentDraft);
    if (!check.allowed) {
      sound.playError();
      showToast(check.reason);
      return;
    }

    sound.playKey(char);
    setGameState((prev) => ({
      ...prev,
      currentDraft: (prev.currentDraft + char.toUpperCase()).slice(0, CODE_LENGTH),
    }));
  }, [gameState.status, gameState.currentDraft, revealingRowIndex, showToast]);

  // Backspace
  const handleBackspace = useCallback(() => {
    if (gameState.status !== GAME_STATUS.IN_PROGRESS || revealingRowIndex !== -1) {
      return;
    }
    if (gameState.currentDraft.length > 0) {
      sound.playBackspace();
      setGameState((prev) => ({
        ...prev,
        currentDraft: prev.currentDraft.slice(0, -1),
      }));
    }
  }, [gameState.status, gameState.currentDraft, revealingRowIndex]);

  // Clear
  const handleClear = useCallback(() => {
    if (gameState.status !== GAME_STATUS.IN_PROGRESS || revealingRowIndex !== -1) {
      return;
    }
    if (gameState.currentDraft.length > 0) {
      sound.playBackspace();
      setGameState((prev) => ({
        ...prev,
        currentDraft: '',
      }));
    }
  }, [gameState.status, gameState.currentDraft, revealingRowIndex]);

  // Submit Guess
  const handleSubmit = useCallback(() => {
    if (gameState.status !== GAME_STATUS.IN_PROGRESS || revealingRowIndex !== -1) {
      return;
    }

    const validation = validateGuess(gameState.currentDraft, gameState.guesses);
    if (!validation.valid) {
      sound.playError();
      showToast(validation.error);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 550);
      addLog(`SUBMISSION REJECTED: ${validation.error}`, 'danger');
      return;
    }

    // Play submission sound
    sound.playSubmit();

    const submissionResult = processGuessSubmission(gameState);
    if (!submissionResult.success) {
      sound.playError();
      showToast(submissionResult.error);
      return;
    }

    const currentRow = gameState.guesses.length;
    const guessWord = gameState.currentDraft.toUpperCase();
    const feedback = submissionResult.feedbackRow;

    addLog(`ANALYZING CODE SEQUENCE [${guessWord}]...`, 'info');

    // Begin flip reveal animation
    setRevealingRowIndex(currentRow);
    setRevealedCellCount(0);

    const stepInterval = 240; // ms per tile
    for (let i = 0; i < CODE_LENGTH; i++) {
      setTimeout(() => {
        setRevealedCellCount(i + 1);
        sound.playFlip(feedback[i]);
      }, (i + 1) * stepInterval);
    }

    // After all tiles revealed
    const totalFlipDuration = (CODE_LENGTH + 1) * stepInterval;
    setTimeout(() => {
      setRevealingRowIndex(-1);
      setRevealedCellCount(CODE_LENGTH);

      const exactMatches = feedback.filter((s) => s === STATUS.CORRECT).length;
      const misplacedMatches = feedback.filter((s) => s === STATUS.MISPLACED).length;

      addLog(`FEEDBACK MATRIX: ${exactMatches} EXACT // ${misplacedMatches} PRESENT`, 'info');

      // Update actual game state
      setGameState(submissionResult.nextState);

      if (submissionResult.won) {
        sound.playWin();
        addLog('PASSWORD CRACKED SUCCESSFULLY! ACCESS GRANTED.', 'success');
        showToast('🎉 PASSWORD CRACKED SUCCESSFULLY! Next password unlocks at 12:00 AM midnight.');

        // Confetti burst
        try {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#538d4e', '#b59f3b', '#0ea5e9', '#6366f1', '#10b981'],
          });
        } catch {}

        // Update stats
        const finalAttempts = currentRow + 1;
        const currentStats = gameState.mode === 'DAILY' ? dailyStats : practiceStats;
        const finalElapsed = Math.max(1, gameState.elapsedSeconds);
        const updatedStats = recordGameStats(currentStats, {
          won: true,
          attempts: finalAttempts,
          elapsedSeconds: finalElapsed,
          date: currentUtcDate,
        });

        if (gameState.mode === 'DAILY') {
          setDailyStats(updatedStats);
        } else {
          setPracticeStats(updatedStats);
        }

        setTimeout(() => setIsResultOpen(true), 900);
      } else if (submissionResult.lost) {
        sound.playLose();
        addLog(`SECURITY BREACH PREVENTED. ACCESS CODE LOCKED: [${gameState.secret}]`, 'danger');

        const currentStats = gameState.mode === 'DAILY' ? dailyStats : practiceStats;
        const updatedStats = recordGameStats(currentStats, {
          won: false,
          attempts: MAX_ATTEMPTS,
          elapsedSeconds: gameState.elapsedSeconds,
          date: currentUtcDate,
        });

        if (gameState.mode === 'DAILY') {
          setDailyStats(updatedStats);
        } else {
          setPracticeStats(updatedStats);
        }

        setTimeout(() => setIsResultOpen(true), 900);
      }
    }, totalFlipDuration);
  }, [
    gameState,
    revealingRowIndex,
    showToast,
    addLog,
    dailyStats,
    practiceStats,
    setDailyStats,
    setPracticeStats,
    currentUtcDate,
  ]);

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if inside an input or textarea or modal is open
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (isResultOpen || isStatsOpen || isSettingsOpen || isHowToPlayOpen) return;

      const key = e.key;

      if (key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (key === 'Escape') {
        e.preventDefault();
        handleClear();
      } else if (/^[a-zA-Z]$/.test(key)) {
        e.preventDefault();
        handleTypeChar(key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleSubmit,
    handleBackspace,
    handleClear,
    handleTypeChar,
    isResultOpen,
    isStatsOpen,
    isSettingsOpen,
    isHowToPlayOpen,
  ]);

  // Score details
  const scoreInfo = useMemo(() => {
    if (gameState.status !== GAME_STATUS.WON) return null;
    const streak = gameState.mode === 'DAILY' ? dailyStats.currentStreak : practiceStats.currentStreak;
    return calculateScore({
      attempts: gameState.guesses.length,
      elapsedSeconds: Math.max(1, gameState.elapsedSeconds),
      streak,
    });
  }, [gameState.status, gameState.guesses.length, gameState.elapsedSeconds, gameState.mode, dailyStats.currentStreak, practiceStats.currentStreak]);

  // Reset practice mission
  const handleNewPracticeGame = useCallback(() => {
    setIsResultOpen(false);
    initPracticeGame(true);
  }, [initPracticeGame]);

  // Reset stats
  const handleResetStats = useCallback(() => {
    if (mode === 'DAILY') {
      setDailyStats(INITIAL_STATS);
      addLog('DAILY STATISTICS PURGED FROM MEMORY BANK.', 'danger');
    } else {
      setPracticeStats(INITIAL_STATS);
      addLog('PRACTICE STATISTICS PURGED FROM MEMORY BANK.', 'danger');
    }
  }, [mode, setDailyStats, setPracticeStats, addLog]);

  return {
    mode,
    gameState,
    keyboardStatus,
    toastMessage,
    isShaking,
    revealingRowIndex,
    revealedCellCount,
    dailyStats,
    practiceStats,
    settings,
    setSettings,
    logs,
    scoreInfo,
    isResultOpen,
    setIsResultOpen,
    isStatsOpen,
    setIsStatsOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    isHowToPlayOpen,
    setIsHowToPlayOpen,
    handleSwitchMode,
    handleTypeChar,
    handleBackspace,
    handleClear,
    handleSubmit,
    handleNewPracticeGame,
    handleResetStats,
    clearToast: () => setToastMessage(null),
  };
}
