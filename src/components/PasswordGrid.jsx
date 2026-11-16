import React from 'react';
import CharacterCell from './CharacterCell.jsx';
import { CODE_LENGTH, MAX_ATTEMPTS } from '../game/feedback.js';
import { GAME_STATUS } from '../game/gameEngine.js';

export default function PasswordGrid({
  guesses = [],
  evaluations = [],
  currentDraft = '',
  status = GAME_STATUS.IN_PROGRESS,
  isShaking = false,
  revealingRowIndex = -1,
  revealedCellCount = CODE_LENGTH,
}) {
  const currentAttempt = guesses.length;

  return (
    <div className="password-grid-wrapper" aria-label="Cipher Decryption Grid">
      <div className="password-grid">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, rowIndex) => {
          const isCompletedRow = rowIndex < currentAttempt;
          const isCurrentRow = rowIndex === currentAttempt && status === GAME_STATUS.IN_PROGRESS;
          const isFutureRow = rowIndex > currentAttempt || (rowIndex === currentAttempt && status !== GAME_STATUS.IN_PROGRESS);
          const isThisRowRevealing = rowIndex === revealingRowIndex;
          const shouldShake = isCurrentRow && isShaking;

          let rowGuess = '';
          let rowEval = [];

          if (isCompletedRow) {
            rowGuess = guesses[rowIndex] || '';
            rowEval = evaluations[rowIndex] || [];
          } else if (isCurrentRow) {
            rowGuess = currentDraft;
          }

          const rowClasses = [
            'grid-row',
            isCurrentRow ? 'current-row' : '',
            isCompletedRow ? 'completed-row' : '',
            isFutureRow ? 'future-row' : '',
            shouldShake ? 'row-shake' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <div key={rowIndex} className={rowClasses} role="row" aria-label={`Attempt ${rowIndex + 1}`}>
              <span className="row-attempt-num">
                {String(rowIndex + 1).padStart(2, '0')}
              </span>

              <div className="row-cells">
                {Array.from({ length: CODE_LENGTH }).map((_, colIndex) => {
                  const char = rowGuess[colIndex] || '';
                  let cellStatus = 'empty';

                  if (isCompletedRow) {
                    // If this row is actively animating its reveal
                    if (isThisRowRevealing) {
                      cellStatus = colIndex < revealedCellCount ? rowEval[colIndex] : 'empty';
                    } else {
                      cellStatus = rowEval[colIndex] || 'empty';
                    }
                  } else if (isCurrentRow && char) {
                    cellStatus = 'draft';
                  }

                  const isCellActive = isCurrentRow && colIndex === currentDraft.length;

                  return (
                    <CharacterCell
                      key={colIndex}
                      char={char}
                      status={cellStatus}
                      isActive={isCellActive}
                      isDraft={isCurrentRow}
                      isRevealing={isThisRowRevealing && colIndex < revealedCellCount}
                      revealDelay={colIndex * 150}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
