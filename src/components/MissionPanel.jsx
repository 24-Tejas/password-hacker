import React from 'react';
import { formatDuration, formatMissionTag } from '../utils/dateUtils.js';
import { MAX_ATTEMPTS } from '../game/feedback.js';

export default function MissionPanel({
  mode,
  missionNumber,
  attemptsUsed,
  elapsedSeconds,
  onNewPractice,
  onOpenStats,
}) {
  const attemptsRemaining = Math.max(0, MAX_ATTEMPTS - attemptsUsed);

  const securityLevel = mode === 'DAILY' ? 'DAILY DECRYPTION' : 'PRACTICE SIMULATOR';
  const missionDescription =
    mode === 'DAILY'
      ? 'Crack today’s 5-letter access code. Letters are highlighted after each attempt.'
      : 'Unlimited training drills. Test your logic without affecting your daily streak.';

  return (
    <section className="mission-panel" aria-label="Mission Intelligence">
      <div className="mission-hud-top">
        <div className="mission-meta-item">
          <span className="meta-label">CHALLENGE</span>
          <span className="meta-value mission-tag">
            {mode === 'DAILY' ? formatMissionTag(missionNumber) : `SIM-${missionNumber}`}
          </span>
        </div>

        <div className="mission-meta-item">
          <span className="meta-label">SECURITY PROTOCOL</span>
          <span className="meta-value security-badge">{securityLevel}</span>
        </div>

        <div className="mission-meta-item">
          <span className="meta-label">ATTEMPTS</span>
          <div className="attempts-indicator-wrap">
            <span className={`meta-value attempts-count ${attemptsRemaining <= 2 ? 'critical' : ''}`}>
              {attemptsRemaining} / {MAX_ATTEMPTS}
            </span>
            <div className="attempts-pip-bar">
              {Array.from({ length: MAX_ATTEMPTS }).map((_, idx) => (
                <span
                  key={idx}
                  className={`attempt-pip ${
                    idx < attemptsUsed ? 'spent' : 'ready'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mission-meta-item">
          <span className="meta-label">TIME</span>
          <span className="meta-value timer-display">
            {formatDuration(elapsedSeconds)}
          </span>
        </div>

        {/* Quick Actions (Stats & New Practice) */}
        <div className="mission-meta-item hud-actions-group">
          {onOpenStats && (
            <button
              type="button"
              className="clean-btn-sm stats-hud-btn"
              onClick={onOpenStats}
              title="View Statistics & Streaks"
            >
              📊 STATS
            </button>
          )}

          {mode === 'PRACTICE' && (
            <button
              type="button"
              className="clean-btn-sm new-practice-btn"
              onClick={onNewPractice}
              title="Generate new practice password"
            >
              ↺ NEW WORD
            </button>
          )}
        </div>
      </div>

      <div className="mission-description-bar">
        <span className="desc-text">{missionDescription}</span>
        <span className="desc-rule-tag">5 LETTERS • A–Z</span>
      </div>
    </section>
  );
}
