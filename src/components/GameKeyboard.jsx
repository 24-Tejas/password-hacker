import React from 'react';

const LETTERS_ROW_1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
const LETTERS_ROW_2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
const LETTERS_ROW_3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

export default function GameKeyboard({
  keyboardStatus = {},
  currentDraft = '',
  onTypeChar,
  onBackspace,
  onClear,
  onSubmit,
  disabled = false,
}) {
  const renderKey = (key, customClass = '') => {
    const status = keyboardStatus[key];

    const classNames = [
      'key-btn',
      customClass,
      status ? `status-${status}` : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        key={key}
        type="button"
        className={classNames}
        onClick={() => onTypeChar(key)}
        disabled={disabled}
        aria-label={`Key ${key}${status ? ` (${status})` : ''}`}
      >
        {key}
      </button>
    );
  };

  return (
    <div className="game-keyboard" role="region" aria-label="Virtual Keyboard">
      {/* Row 1 */}
      <div className="keyboard-row">
        {LETTERS_ROW_1.map((letter) => renderKey(letter))}
      </div>

      {/* Row 2 */}
      <div className="keyboard-row row-with-spacer">
        <div className="row-spacer" />
        {LETTERS_ROW_2.map((letter) => renderKey(letter))}
        <div className="row-spacer" />
      </div>

      {/* Row 3 with ENTER & BACKSPACE */}
      <div className="keyboard-row">
        <button
          type="button"
          className="key-btn action-key submit-key"
          onClick={onSubmit}
          disabled={disabled || currentDraft.length !== 5}
          aria-label="Submit password guess"
          title="Submit guess (Enter)"
        >
          ENTER
        </button>

        {LETTERS_ROW_3.map((letter) => renderKey(letter))}

        <button
          type="button"
          className="key-btn action-key backspace-key"
          onClick={onBackspace}
          disabled={disabled || currentDraft.length === 0}
          aria-label="Backspace"
          title="Delete letter (Backspace)"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
            <line x1="18" y1="9" x2="12" y2="15"></line>
            <line x1="12" y1="9" x2="18" y2="15"></line>
          </svg>
        </button>
      </div>

      {/* Utility Bar */}
      <div className="keyboard-utility-bar">
        <span className="utility-hint">
          5-LETTER ACCESS CODE • LETTERS ONLY
        </span>
        {currentDraft.length > 0 && (
          <button
            type="button"
            className="clear-btn"
            onClick={onClear}
            disabled={disabled}
            title="Clear current letters (Esc)"
          >
            CLEAR (ESC)
          </button>
        )}
      </div>
    </div>
  );
}
