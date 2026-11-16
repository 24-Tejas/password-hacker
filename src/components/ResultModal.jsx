import React, { useState, useEffect } from 'react';
import { getTimeUntilNextUtcMidnight, formatDuration, formatMissionTag } from '../utils/dateUtils.js';
import { shareImageResult, generateShareText } from '../utils/shareUtils.js';
import { generateResultImage } from '../utils/imageShareUtils.js';
import { MAX_ATTEMPTS } from '../game/feedback.js';
import { GAME_STATUS } from '../game/gameEngine.js';

export default function ResultModal({
  isOpen,
  onClose,
  gameState,
  onSwitchMode,
  onNewPractice,
  onOpenStats,
  showToast,
}) {
  const [countdown, setCountdown] = useState(getTimeUntilNextUtcMidnight().formatted);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeUntilNextUtcMidnight().formatted);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Pre-generate image preview when modal opens
  useEffect(() => {
    if (isOpen && gameState.status !== GAME_STATUS.IN_PROGRESS) {
      const isDaily = gameState.mode === 'DAILY';
      const missionTag = isDaily
        ? formatMissionTag(gameState.missionNumber)
        : `SIM-${gameState.missionNumber}`;

      generateResultImage({
        mode: gameState.mode,
        missionTag,
        won: gameState.status === GAME_STATUS.WON,
        attempts: gameState.guesses.length,
        maxAttempts: MAX_ATTEMPTS,
        guesses: gameState.guesses,
        evaluations: gameState.evaluations,
        secret: gameState.secret,
        elapsedSeconds: Math.max(1, gameState.elapsedSeconds),
      }).then((res) => {
        setImagePreviewUrl(res.dataUrl);
      }).catch(() => {});
    }
  }, [isOpen, gameState]);

  if (!isOpen || gameState.status === GAME_STATUS.IN_PROGRESS) return null;

  const isWon = gameState.status === GAME_STATUS.WON;
  const isDaily = gameState.mode === 'DAILY';
  const attemptsUsed = gameState.guesses.length;
  const missionTag = isDaily
    ? formatMissionTag(gameState.missionNumber)
    : `SIM-${gameState.missionNumber}`;

  const handleShareImage = async () => {
    setIsGeneratingImage(true);
    try {
      const { file, dataUrl } = await generateResultImage({
        mode: gameState.mode,
        missionTag,
        won: isWon,
        attempts: attemptsUsed,
        maxAttempts: MAX_ATTEMPTS,
        guesses: gameState.guesses,
        evaluations: gameState.evaluations,
        secret: gameState.secret,
        elapsedSeconds: Math.max(1, gameState.elapsedSeconds),
      });

      const shareText = generateShareText({
        isDaily,
        missionTag,
        won: isWon,
        attempts: attemptsUsed,
        maxAttempts: MAX_ATTEMPTS,
        evaluations: gameState.evaluations,
        elapsedSeconds: gameState.elapsedSeconds,
      });

      const res = await shareImageResult(file, dataUrl, shareText);
      if (res.method === 'share') {
        showToast('IMAGE SHARED VIA SYSTEM DIALOG');
      } else if (res.method === 'download') {
        showToast('IMAGE SAVED & SUMMARY COPIED');
      }
    } catch {
      showToast('UNABLE TO EXPORT IMAGE');
    } finally {
      setIsGeneratingImage(false);
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

        {/* 12:00 AM Countdown Callout */}
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

        {/* Performance Metrics (Attempts & Time) */}
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
        </div>

        {/* Steps Image Card Preview */}
        {imagePreviewUrl && (
          <div className="share-image-preview-container">
            <div className="preview-header-label">YOUR DECRYPTION STEPS (SHAREABLE IMAGE):</div>
            <img
              src={imagePreviewUrl}
              alt="Decryption Steps Summary Card"
              className="share-result-image-preview"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="modal-actions-group">
          <button
            type="button"
            className="clean-btn clean-btn-primary share-btn"
            onClick={handleShareImage}
            disabled={isGeneratingImage}
          >
            {isGeneratingImage ? 'GENERATING IMAGE...' : '📤 SHARE IMAGE & STEPS'}
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
