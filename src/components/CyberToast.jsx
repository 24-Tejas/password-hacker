import React, { useEffect } from 'react';

export default function CyberToast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="cyber-toast-container" role="status" aria-live="polite">
      <div className="cyber-toast">
        <span className="toast-icon">ℹ️</span>
        <span className="toast-text">{message}</span>
        <button className="toast-close" onClick={onClose} aria-label="Dismiss message">
          ✕
        </button>
      </div>
    </div>
  );
}
