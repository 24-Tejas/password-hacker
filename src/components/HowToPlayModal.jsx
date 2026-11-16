import React from 'react';

export default function HowToPlayModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card manual-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="modal-header">
          <h2 className="modal-title">
            <span>📖</span> HOW TO PLAY
          </h2>
          <p className="modal-subtitle">GUESS THE 5-LETTER ACCESS PASSWORD IN 6 TRIES</p>
        </div>

        <div className="manual-content">
          <p className="manual-intro">
            Crack the secret 5-letter access password within <strong>6 attempts</strong>.
            After every guess, the color of the tiles will change to show how close your guess was to the password.
          </p>

          <div className="rules-highlight-box">
            <div className="rule-pill">
              <span className="rule-badge">LENGTH</span>
              <span>Each guess must be a valid 5-letter word</span>
            </div>
            <div className="rule-pill">
              <span className="rule-badge">ALPHABET</span>
              <span>Letters A through Z only (No numbers)</span>
            </div>
          </div>

          <h3 className="manual-section-heading">EXAMPLES</h3>

          {/* Example 1: Green */}
          <div className="example-group">
            <div className="example-row">
              <div className="example-cell status-correct">P</div>
              <div className="example-cell">R</div>
              <div className="example-cell">O</div>
              <div className="example-cell">X</div>
              <div className="example-cell">Y</div>
            </div>
            <p className="example-explanation">
              <strong className="color-green">P</strong> is in the password and in the <strong>correct spot</strong>.
            </p>
          </div>

          {/* Example 2: Yellow */}
          <div className="example-group">
            <div className="example-row">
              <div className="example-cell">C</div>
              <div className="example-cell status-misplaced">L</div>
              <div className="example-cell">O</div>
              <div className="example-cell">U</div>
              <div className="example-cell">D</div>
            </div>
            <p className="example-explanation">
              <strong className="color-yellow">L</strong> is in the password but in the <strong>wrong spot</strong>.
            </p>
          </div>

          {/* Example 3: Grey */}
          <div className="example-group">
            <div className="example-row">
              <div className="example-cell">T</div>
              <div className="example-cell">O</div>
              <div className="example-cell">K</div>
              <div className="example-cell status-wrong">E</div>
              <div className="example-cell">N</div>
            </div>
            <p className="example-explanation">
              <strong className="color-grey">E</strong> is <strong>not in the password</strong> in any spot.
            </p>
          </div>

          <h3 className="manual-section-heading">MODES</h3>
          <div className="modes-explanation-grid">
            <div className="mode-desc-card">
              <div className="mode-desc-title">✦ DAILY CHALLENGE</div>
              <p>
                A new synchronized password unlocks every night at 12:00 AM midnight. Compete with players worldwide and maintain your winning streak!
              </p>
            </div>
            <div className="mode-desc-card">
              <div className="mode-desc-title">↺ PRACTICE MODE</div>
              <p>
                Unlimited practice sessions with random passwords. Train your deduction skills anytime.
              </p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="clean-btn clean-btn-primary" onClick={onClose}>
            GOT IT, START CRACKING ❯
          </button>
        </div>
      </div>
    </div>
  );
}
