import React from 'react';

export default function CharacterCell({
  char = '',
  status = 'empty',
  isRevealing = false,
  revealDelay = 0,
  isActive = false,
  isDraft = false,
}) {
  const hasChar = char.length > 0;

  const classNames = [
    'char-cell',
    status !== 'empty' ? `status-${status}` : '',
    isActive ? 'is-active' : '',
    isDraft ? 'is-draft' : '',
    hasChar && !status ? 'has-char' : '',
    isRevealing ? 'is-flipping' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const style = isRevealing ? { animationDelay: `${revealDelay}ms` } : undefined;

  return (
    <div className={classNames} style={style} aria-label={`Cell ${char || 'empty'}`}>
      <div className="char-cell-inner">
        <span className="char-glyph">{char}</span>
      </div>
      {isActive && !hasChar && <span className="cell-cursor" />}
    </div>
  );
}
