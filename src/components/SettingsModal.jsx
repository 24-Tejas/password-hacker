import React from 'react';
import { sound } from '../game/soundEngine.js';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  setSettings,
}) {
  if (!isOpen) return null;

  const toggleSetting = (key) => {
    setSettings((prev) => {
      const nextVal = !prev[key];
      if (key === 'soundEnabled' && nextVal) {
        sound.setEnabled(true);
        sound.playKey('A');
      }
      return {
        ...prev,
        [key]: nextVal,
      };
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card settings-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="modal-header">
          <h2 className="modal-title">
            <span className="title-icon">⚙</span> SYSTEM CONFIGURATION
          </h2>
          <p className="modal-subtitle">TERMINAL PREFERENCES AND PROTOCOLS</p>
        </div>

        <div className="settings-list">
          {/* Sound FX Toggle */}
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-name">SYNTH SOUND EFFECTS</span>
              <span className="setting-desc">Tactile mechanical clicks, sweeps, and feedback chimes</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.soundEnabled}
              className={`cyber-toggle ${settings.soundEnabled ? 'active' : ''}`}
              onClick={() => toggleSetting('soundEnabled')}
            >
              <span className="toggle-thumb" />
            </button>
          </div>

          {/* CRT Scanlines Toggle */}
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-name">CRT SCANLINE MATRIX</span>
              <span className="setting-desc">Retro terminal phosphor raster lines and subtle vignette</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.crtScanlines}
              className={`cyber-toggle ${settings.crtScanlines ? 'active' : ''}`}
              onClick={() => toggleSetting('crtScanlines')}
            >
              <span className="toggle-thumb" />
            </button>
          </div>

          {/* Animations Toggle */}
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-name">SMOOTH TILE FLIP CASCADE</span>
              <span className="setting-desc">Sequential 3D decryption card flip reveals</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.animationsEnabled}
              className={`cyber-toggle ${settings.animationsEnabled ? 'active' : ''}`}
              onClick={() => toggleSetting('animationsEnabled')}
            >
              <span className="toggle-thumb" />
            </button>
          </div>
        </div>

        {/* Keyboard Shortcuts Reference */}
        <div className="shortcuts-reference-box">
          <div className="reference-title">HARDWARE INTERFACE SHORTCUTS:</div>
          <div className="shortcuts-grid">
            <div className="shortcut-row">
              <kbd className="cyber-kbd">A - Z</kbd>
              <span>Type letter into password buffer</span>
            </div>
            <div className="shortcut-row">
              <kbd className="cyber-kbd">ENTER</kbd>
              <span>Execute and analyze 5-character cipher</span>
            </div>
            <div className="shortcut-row">
              <kbd className="cyber-kbd">BACKSPACE</kbd>
              <span>Delete preceding character</span>
            </div>
            <div className="shortcut-row">
              <kbd className="cyber-kbd">ESC</kbd>
              <span>Purge current input buffer</span>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="settings-footer">
          <div className="version-info">
            <span>PASSWORD HACKER v1.0.4-PROD</span>
            <span>ENGINE: REACT 19 + VITE + WEB AUDIO</span>
          </div>
        </div>
      </div>
    </div>
  );
}
