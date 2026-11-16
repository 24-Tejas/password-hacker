import React, { useState, useEffect } from 'react';
import { getTimeUntilNextUtcMidnight, formatDuration, formatMissionTag } from '../utils/dateUtils.js';
import { shareGameResult } from '../utils/shareUtils.js';
import { MAX_ATTEMPTS } from '../game/feedback.js';
import { GAME_STATUS } from '../game/gameEngine.js';

export default function ResultModal({
  isOpen,
  onClose,
  gameState,
  scoreInfo,
  onSwitchMode,
  onNewPractice,
  onOpenStats,
  showToast,
}) {
  const [countdown, setCountdown] = useState(getTimeUntilNextUtcMidnight().formatted);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeUntilNextUtcMidnight().formatted);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen || gameState.status === GAME_STATUS.IN_PROGRESS) return null;

  const isWon = gameState.status === GAME_STATUS.WON;
  const isDaily = gameState.mode === 'DAILY';
  const attemptsUsed = gameState.guesses.length;
  const missionTag = isDaily
    ? formatMissionTag(gameState.missionNumber)
    : `SIM-${gameState.missionNumber}`;

  const handleShare = async () => {
    const res = await shareGameResult({
      isDaily,
      missionTag,
      won: isWon,
      attempts: attemptsUsed,
      maxAttempts: MAX_ATTEMPTS,
      evaluations: gameState.evaluations,
      elapsedSeconds: gameState.elapsedSeconds,
      score: scoreInfo?.totalScore,
    });

    if (res.method === 'clipboard') {
      setCopied(true);
      showToast('RESULTS COPIED TO CLIPBOARD');
      setTimeout(() => setCopied(false), 2500);
    } else if (res.method === 'share') {
      showToast('SHARED SUCCESSFULLY');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card result-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {/* Celebratory Alert Banner */}
        <div className={`result-header-badge ${isWon ? 'badge-success' : 'badge-failure'}`}>
          <div className="result-status-icon">{isWon ? '🎉' : '🔒'}</div>
          <h2 className="result-headline">
            {isWon ? 'PASSWORD CRACKED SUCCESSFULLY!' : 'ACCESS DENIED'}
          </h2>
          <p className="result-subhead">
            {isWon
              ? 'CIPHER DECRYPTED • ACCESS GRANTED'
              : 'ATTEMPTS EXHAUSTED • SECURITY LOCKOUT'}
          </p>
        </div>

        {/* Revealed Secret Password */}
        <div className="secret-reveal-box">
          <span className="reveal-label">TARGET PASSWORD:</span>
          <div className="reveal-code-display">
            {gameState.secret.split('').map((char, idx) => (
              <span key={idx} className={`reveal-char-pill ${isWon ? 'pill-success' : 'pill-failure'}`}>
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Next Try Countdown Callout */}
        {isDaily ? (
          <div className="countdown-callout-box">
            <span className="countdown-callout-label">NEXT PASSWORD AT 12:00 AM:</span>
            <span className="countdown-callout-timer">{countdown}</span>
            <span className="countdown-callout-note">A brand new password unlocks tonight at 12:00 AM midnight</span>
          </div>
        ) : (
          <div className="practice-prompt-box">
            <span>Practice session completed. Ready for another cipher?</span>
          </div>
        )}

        {/* Performance Metrics Grid */}
        <div className="result-metrics-grid">
          <div className="metric-cell">
            <span className="metric-label">ATTEMPTS</span>
            <span className="metric-value">
              {attemptsUsed} / {MAX_ATTEMPTS}
            </span>
          </div>

          <div className="metric-cell">
            <span className="metric-label">TIME</span>
            <span className="metric-value">
              {formatDuration(isWon ? Math.max(1, gameState.elapsedSeconds) : gameState.elapsedSeconds)}
            </span>
          </div>

          {isWon && scoreInfo && (
            <>
              <div className="metric-cell highlight-score">
                <span className="metric-label">SCORE</span>
                <span className="metric-value">{scoreInfo.totalScore.toLocaleString()}</span>
              </div>

              <div className="metric-cell">
                <span className="metric-label">RANK</span>
                <span className="metric-value grade-badge">{scoreInfo.grade}</span>
              </div>
            </>
          )}
        </div>

        {/* Visual Share Preview */}
        <div className="share-matrix-preview" aria-hidden="true">
          {gameState.evaluations.map((row, rIdx) => (
            <div key={rIdx} className="share-preview-row">
              {row.map((status, cIdx) => (
                <span
                  key={cIdx}
                  className={`preview-chip chip-${status}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="modal-actions-group">
          <button
            type="button"
            className="clean-btn clean-btn-primary share-btn"
            onClick={handleShare}
          >
            {copied ? '✓ COPIED TO CLIPBOARD' : 'SHARE RESULT ↗'}
          </button>

          {onOpenStats && (
            <button
              type="button"
              className="clean-btn clean-btn-secondary"
              onClick={() => {
                onClose();
                onOpenStats();
              }}
            >
              📊 VIEW FULL STATISTICS
            </button>
          )}

          {isDaily && !isWon && (
            <button
              type="button"
              className="clean-btn clean-btn-secondary"
              onClick={() => {
                onClose();
                onSwitchMode('PRACTICE');
              }}
            >
              TRY PRACTICE MODE ❯
            </button>
          )}

          {!isDaily && (
            <button
              type="button"
              className="clean-btn clean-btn-accent"
              onClick={onNewPractice}
            >
              ↺ NEW PRACTICE PASSWORD
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
