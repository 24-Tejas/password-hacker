import React, { useEffect, useRef, useState } from 'react';

export default function TerminalLog({ logs = [] }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const logEndRef = useRef(null);

  // Auto-scroll to bottom on new log item
  useEffect(() => {
    if (!isCollapsed && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isCollapsed]);

  return (
    <aside className={`terminal-log-panel ${isCollapsed ? 'is-collapsed' : ''}`} aria-label="System Diagnostics Log">
      <div className="terminal-header-bar" onClick={() => setIsCollapsed(!isCollapsed)}>
        <div className="window-dots">
          <span className="dot dot-red" />
          <span className="dot dot-amber" />
          <span className="dot dot-green" />
        </div>
        <div className="terminal-title">
          <span className="title-prompt">root@cipher-core:</span>
          <span className="title-path">~/logs/breach.log</span>
        </div>
        <button
          type="button"
          className="collapse-toggle-btn"
          aria-label={isCollapsed ? 'Expand Terminal' : 'Collapse Terminal'}
        >
          {isCollapsed ? '▲ EXPAND' : '▼ HIDE'}
        </button>
      </div>

      {!isCollapsed && (
        <div className="terminal-body" tabIndex={0}>
          <div className="terminal-log-list">
            {logs.map((log) => (
              <div key={log.id} className={`terminal-line log-${log.type}`}>
                <span className="log-timestamp">[{log.time}]</span>
                <span className="log-tag">{log.type.toUpperCase()}:</span>
                <span className="log-content">{log.text}</span>
              </div>
            ))}
            <div className="terminal-cursor-line">
              <span className="cursor-prompt">&gt;</span>
              <span className="blinking-cursor">_</span>
            </div>
            <div ref={logEndRef} />
          </div>
        </div>
      )}
    </aside>
  );
}
