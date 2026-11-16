import React from 'react';

export default function Header({
  mode,
  onSwitchMode,
  onOpenHowToPlay,
  onOpenStats,
  onOpenSettings,
}) {
  return (
    <header className="terminal-header">
      <div className="header-brand">
        <div className="brand-logo-container">
          <span className="brand-lock-icon">🔐</span>
          <h1 className="brand-title">
            PASSWORD<span className="brand-accent">HACKER</span>
          </h1>
        </div>
        <div className="system-status-indicator">
          <span className="status-dot"></span>
          <span className="status-text">DECRYPTOR ONLINE</span>
        </div>
      </div>

      <div className="header-controls">
        {/* Mode Switcher */}
        <div className="mode-toggle-group" role="tablist" aria-label="Game Modes">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'DAILY'}
            className={`mode-btn ${mode === 'DAILY' ? 'active' : ''}`}
            onClick={() => onSwitchMode('DAILY')}
          >
            DAILY
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'PRACTICE'}
            className={`mode-btn ${mode === 'PRACTICE' ? 'active' : ''}`}
            onClick={() => onSwitchMode('PRACTICE')}
          >
            PRACTICE
          </button>
        </div>

        {/* Action Icons */}
        <div className="header-icon-actions">
          <button
            type="button"
            className="icon-action-btn"
            onClick={onOpenHowToPlay}
            title="How to Play"
            aria-label="How to play"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </button>

          <button
            type="button"
            className="icon-action-btn"
            onClick={onOpenStats}
            title="Statistics"
            aria-label="View statistics"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          </button>

          <button
            type="button"
            className="icon-action-btn"
            onClick={onOpenSettings}
            title="Settings"
            aria-label="Settings"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
