# 🔐 PASSWORD CRACKER

> **Addictive daily code-breaking puzzle game inspired by Wordle and Mastermind.**  
> Crack the secret 5-letter access password in 6 attempts with soothing eye-friendly aesthetics, instant feedback, haptic typing, and shareable decryption image cards.

![Password Cracker](https://img.shields.io/badge/PASSWORD-CRACKER-538d4e?style=for-the-badge&logo=target)
![React 19](https://img.shields.io/badge/React-19.3.1-61dafb?style=for-the-badge&logo=react)
![Vite 8](https://img.shields.io/badge/Vite-8.3.6-646cff?style=for-the-badge&logo=vite)
![Zero Backend](https://img.shields.io/badge/Backend-100%25%20Client--Side-00f0ff?style=for-the-badge)

---

## 🎮 Gameplay Rules

1. **Target Cipher**: Exactly **5 letters** (`A–Z` only, no numbers).
2. **Attempts**: Players receive **6 attempts** per session.
3. **Timer Starts on First Guess**: The timer begins ticking only after you submit your first word.
4. **Feedback Telemetry (Wordle 2-pass logic)**:
   - 🟩 **GREEN**: Correct letter in the exact position.
   - 🟨 **YELLOW**: Correct letter, but in a different position.
   - ⬜ **GREY**: Letter does not exist anywhere in the secret password.
5. **Victory**: Decrypt all 5 positions within 6 attempts (`PASSWORD CRACKED SUCCESSFULLY!`).
6. **Defeat**: Exhaust all 6 attempts without deciphering (`ACCESS DENIED`).

---

## 🕹 Game Modes

### 1. ✦ Daily Challenge
- One synchronized puzzle per calendar day.
- Deterministic seeded pseudorandom generation derived from the date.
- Next daily puzzle unlocks every night at **12:00 AM midnight**.
- Refreshing the browser preserves your active guesses, time, and state.
- Tracks daily win streaks, attempt distribution, and records in `localStorage`.
- Live countdown timer to the next 12:00 AM unlock.

### 2. ↺ Practice Simulator
- Unlimited practice games with freshly randomized 5-letter words.
- Practice drills never modify your official Daily Challenge streaks or statistics.
- Instant "New Word" button for continuous gameplay.

---

## 🎨 UI & Features

- **Soothing Light Theme**: Clean eye-friendly palette (`#f8fafc` canvas, `#ffffff` cards, `#e2e8f0` borders) with authentic Wordle tile colors (`#538d4e`, `#b59f3b`, `#787c7e`).
- **Tactile Mobile Haptics**: Subtle vibration feedback when tapping keys (`navigator.vibrate`), backspacing, or submitting on mobile devices.
- **Visual Image Sharing**: Exports high-resolution PNG image cards showing your complete decryption steps, tile colors, target word, attempts, time, and statistics via native Web Share API or direct download.
- **Synthesized Web Audio Engine**: Procedurally generates mechanical key clicks, tile flip chords, alert buzzers, and victory arpeggios via the Web Audio API without external audio files.
- **Responsive Layout**: Engineered and tested for mobile devices (down to 320px screen width), tablets, and desktop displays.

---

## 📁 Project Architecture

```
password-cracker/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── CharacterCell.jsx       # Tile cell with flip animation & status colors
│   │   ├── CyberToast.jsx          # Non-intrusive alert toasts
│   │   ├── GameKeyboard.jsx        # 3-row QWERTY keyboard with tactile haptics
│   │   ├── Header.jsx              # Brand header, mode switcher, mobile stats button
│   │   ├── HowToPlayModal.jsx      # Rules manual with visual color examples
│   │   ├── MissionPanel.jsx        # Target challenge, attempts pips, timer
│   │   ├── PasswordGrid.jsx        # 6x5 attempt decryption grid
│   │   ├── ResultModal.jsx         # Cracked/Denied banner, countdown, steps image share
│   │   ├── SettingsModal.jsx       # Sound, scanlines, animations, shortcuts
│   │   ├── StatisticsModal.jsx     # Win %, streaks, attempt distribution chart
│   │   └── TerminalLog.jsx         # System telemetry stream (no page jumping)
│   │
│   ├── game/
│   │   ├── dailyGenerator.js       # Seeded deterministic daily word PRNG
│   │   ├── feedback.js             # Pure 2-pass Wordle feedback algorithm
│   │   ├── gameEngine.js           # Pure game state transitions & keyboard map
│   │   ├── scoring.js              # Score calculation & telemetry metrics
│   │   ├── soundEngine.js          # Web Audio procedural sound synthesizer
│   │   └── words.js                # Curated 5-letter tech and dictionary word list
│   │
│   ├── hooks/
│   │   ├── useGame.js              # Central game orchestrator hook with haptics
│   │   └── useLocalStorage.js      # Resilient localStorage persistence hook
│   │
│   ├── utils/
│   │   ├── dateUtils.js            # Midnight countdown calculations & formatting
│   │   ├── imageShareUtils.js      # High-res canvas image generation with steps
│   │   └── shareUtils.js           # Native Web Share API with image file sharing
│   │
│   ├── styles/
│   │   ├── global.css              # Variables, resets, typography
│   │   └── game.css                # Complete responsive stylesheet
│   │
│   ├── App.jsx                     # Root application view
│   ├── index.css                   # Stylesheet imports
│   └── main.jsx                    # React 19 entry point
│
├── test-suite.js                   # Automated test suite (17 edge-case tests)
├── index.html                      # HTML5 template with light theme meta
├── package.json                    # Project dependencies and npm scripts
└── vite.config.js                  # Vite bundler configuration
```

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js (version 18+ or 20+ recommended)
- npm, pnpm, or yarn

### Installation
```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
```

Open your browser at `http://localhost:5173`.

### Run Automated Tests
```bash
npm test
```

### Production Build
```bash
npm run build
```
The optimized static build will be output to the `dist/` directory.

---

## 🌐 Deployment Instructions

`PASSWORD CRACKER` is a 100% client-side Single Page Application (SPA). It requires zero server runtimes, databases, or API keys.

### Deploying to Vercel

#### Method 1: Using the Vercel CLI
```bash
npx vercel
```
For production redeployments:
```bash
npx vercel --prod
```

#### Method 2: Git Integration via Vercel Dashboard
1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and import the repository.
3. Configure settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**. Any future `git push` to your GitHub branch will automatically trigger a new Vercel deployment!

---

## 🛡 License

MIT License. Designed and engineered for maximum immersion and responsive performance.
