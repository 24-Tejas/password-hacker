import React from 'react';
import { useGame } from './hooks/useGame.js';
import Header from './components/Header.jsx';
import MissionPanel from './components/MissionPanel.jsx';
import PasswordGrid from './components/PasswordGrid.jsx';
import GameKeyboard from './components/GameKeyboard.jsx';
import TerminalLog from './components/TerminalLog.jsx';
import ResultModal from './components/ResultModal.jsx';
import StatisticsModal from './components/StatisticsModal.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import HowToPlayModal from './components/HowToPlayModal.jsx';
import CyberToast from './components/CyberToast.jsx';

import './styles/global.css';
import './styles/game.css';

export default function App() {
  const {
    mode,
    gameState,
    keyboardStatus,
    toastMessage,
    isShaking,
    revealingRowIndex,
    revealedCellCount,
    dailyStats,
    practiceStats,
    settings,
    setSettings,
    logs,
    scoreInfo,
    isResultOpen,
    setIsResultOpen,
    isStatsOpen,
    setIsStatsOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    isHowToPlayOpen,
    setIsHowToPlayOpen,
    handleSwitchMode,
    handleTypeChar,
    handleBackspace,
    handleClear,
    handleSubmit,
    handleNewPracticeGame,
    handleResetStats,
    clearToast,
  } = useGame();

  return (
    <div className="game-viewport">
      {/* Optional CRT Scanline raster overlay */}
      {settings.crtScanlines && <div className="crt-overlay" aria-hidden="true" />}

      {/* Main Terminal Header */}
      <Header
        mode={mode}
        onSwitchMode={handleSwitchMode}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Play Area */}
      <main className="game-main-content">
        {/* Mission Briefing HUD */}
        <MissionPanel
          mode={mode}
          missionNumber={gameState.missionNumber}
          attemptsUsed={gameState.guesses.length}
          elapsedSeconds={gameState.elapsedSeconds}
          onNewPractice={handleNewPracticeGame}
          onOpenStats={() => setIsStatsOpen(true)}
        />

        {/* 6x5 Decryption Grid */}
        <PasswordGrid
          guesses={gameState.guesses}
          evaluations={gameState.evaluations}
          currentDraft={gameState.currentDraft}
          status={gameState.status}
          isShaking={isShaking}
          revealingRowIndex={revealingRowIndex}
          revealedCellCount={revealedCellCount}
        />

        {/* Alphanumeric Virtual Keyboard */}
        <GameKeyboard
          keyboardStatus={keyboardStatus}
          currentDraft={gameState.currentDraft}
          onTypeChar={handleTypeChar}
          onBackspace={handleBackspace}
          onClear={handleClear}
          onSubmit={handleSubmit}
          disabled={revealingRowIndex !== -1}
        />

        {/* System Terminal Diagnostics Log */}
        <TerminalLog logs={logs} />
      </main>

      {/* Interactive HUD Toast */}
      <CyberToast message={toastMessage} onClose={clearToast} />

      {/* Modals */}
      <ResultModal
        isOpen={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        gameState={gameState}
        scoreInfo={scoreInfo}
        onSwitchMode={handleSwitchMode}
        onNewPractice={handleNewPracticeGame}
        onOpenStats={() => setIsStatsOpen(true)}
        showToast={clearToast}
      />

      <StatisticsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        dailyStats={dailyStats}
        practiceStats={practiceStats}
        activeMode={mode}
        onResetStats={handleResetStats}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        setSettings={setSettings}
      />

      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />
    </div>
  );
}
