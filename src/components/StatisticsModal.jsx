import React, { useState } from 'react';
import { getDerivedStats } from '../game/scoring.js';
import { formatDuration } from '../utils/dateUtils.js';

export default function StatisticsModal({
  isOpen,
  onClose,
  dailyStats,
  practiceStats,
  activeMode,
  onResetStats,
}) {
  const [selectedTab, setSelectedTab] = useState(activeMode);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const currentStats = selectedTab === 'DAILY' ? dailyStats : practiceStats;
  const { winPercentage, averageAttempts } = getDerivedStats(currentStats);

  // Find max count in distribution for proportional bar widths
  const dist = currentStats.guessDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const maxCount = Math.max(1, ...Object.values(dist));

  const handleConfirmReset = () => {
    onResetStats();
    setShowConfirmReset(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card stats-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="modal-header">
          <h2 className="modal-title">
            <span className="title-icon">📊</span> SYSTEM TELEMETRY
          </h2>
          <p className="modal-subtitle">ARCHIVED CIPHER CRACKING METRICS</p>
        </div>

        {/* Tab switch between Daily and Practice */}
        <div className="stats-tab-bar" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={selectedTab === 'DAILY'}
            className={`stats-tab-btn ${selectedTab === 'DAILY' ? 'active' : ''}`}
            onClick={() => setSelectedTab('DAILY')}
          >
            DAILY MISSIONS
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedTab === 'PRACTICE'}
            className={`stats-tab-btn ${selectedTab === 'PRACTICE' ? 'active' : ''}`}
            onClick={() => setSelectedTab('PRACTICE')}
          >
            PRACTICE SIMULATIONS
          </button>
        </div>

        {/* Top KPI Metrics */}
        <div className="stats-kpi-grid">
          <div className="kpi-card">
            <span className="kpi-num">{currentStats.gamesPlayed}</span>
            <span className="kpi-desc">PLAYED</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-num">{winPercentage}%</span>
            <span className="kpi-desc">WIN RATE</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-num">{currentStats.currentStreak}</span>
            <span className="kpi-desc">STREAK</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-num">{currentStats.longestStreak}</span>
            <span className="kpi-desc">MAX STREAK</span>
          </div>
        </div>

        {/* Secondary KPIs */}
        <div className="stats-secondary-row">
          <div className="sec-kpi">
            <span className="sec-label">AVERAGE ATTEMPTS:</span>
            <span className="sec-val">{averageAttempts}</span>
          </div>
          <div className="sec-kpi">
            <span className="sec-label">BEST RECORD TIME:</span>
            <span className="sec-val">
              {currentStats.bestTimeSeconds !== null
                ? formatDuration(currentStats.bestTimeSeconds)
                : '--:--'}
            </span>
          </div>
        </div>

        {/* Guess Distribution Bar Chart */}
        <div className="distribution-section">
          <h3 className="section-title">ATTEMPT DISTRIBUTION</h3>
          <div className="distribution-chart">
            {[1, 2, 3, 4, 5, 6].map((attemptNum) => {
              const count = dist[attemptNum] || 0;
              const widthPct = Math.max(7, Math.round((count / maxCount) * 100));

              return (
                <div key={attemptNum} className="chart-row">
                  <span className="chart-label">{attemptNum}</span>
                  <div className="chart-bar-track">
                    <div
                      className={`chart-bar-fill ${count > 0 ? 'has-data' : ''}`}
                      style={{ width: `${widthPct}%` }}
                    >
                      <span className="chart-count">{count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset Danger Zone */}
        <div className="danger-zone-container">
          {!showConfirmReset ? (
            <button
              type="button"
              className="danger-link-btn"
              onClick={() => setShowConfirmReset(true)}
            >
              PURGE {selectedTab} TELEMETRY DATA
            </button>
          ) : (
            <div className="confirm-reset-box">
              <span className="confirm-warning">
                ⚠ Irreversible operation: Reset all {selectedTab.toLowerCase()} statistics?
              </span>
              <div className="confirm-btn-row">
                <button
                  type="button"
                  className="cyber-btn-sm cyber-btn-danger"
                  onClick={handleConfirmReset}
                >
                  CONFIRM PURGE
                </button>
                <button
                  type="button"
                  className="cyber-btn-sm"
                  onClick={() => setShowConfirmReset(false)}
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
