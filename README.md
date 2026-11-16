# ⚡ PASSWORD HACKER

> **Addictive daily code-breaking puzzle game inspired by Wordle and Mastermind.**  
> Infiltrate the mainframe, crack the 5-character cipher in 6 attempts, and climb the operative rankings.

![Password Hacker Banner](https://img.shields.io/badge/SECURITY-ALPHA--5%20PROTOCOL-00ff66?style=for-the-badge&logo=target)
![React 19](https://img.shields.io/badge/React-19.3.1-61dafb?style=for-the-badge&logo=react)
![Vite 8](https://img.shields.io/badge/Vite-8.3.6-646cff?style=for-the-badge&logo=vite)
![Zero Backend](https://img.shields.io/badge/Backend-100%25%20Client--Side-00f0ff?style=for-the-badge)

---

## 🎮 Gameplay Rules

1. **Target Cipher**: Contains exactly **5 characters**.
2. **Valid Characters**: Uppercase alphanumeric `A–Z` and `0–9` (36 possible symbols).
3. **No Duplicate Characters**: Every character in the secret access code is completely unique.
4. **Attempts**: Players receive **6 attempts** per session.
5. **Feedback Telemetry**:
   - 🟩 **GREEN**: Correct character in the exact position.
   - 🟨 **YELLOW**: Correct character in the code, but in a different position.
   - ⬛ **GREY**: Character does not exist anywhere in the access code.
6. **Victory**: Decrypt all 5 characters within 6 attempts (`ACCESS GRANTED`).
7. **Defeat**: Exhaust all 6 attempts without cracking the code (`ACCESS DENIED`).

---

## 🕹 Game Modes

### 1. ✦ Daily Challenge
- One synchronized puzzle generated globally per UTC calendar day.
- Fully deterministic seeded pseudorandom generation derived from the UTC date (`YYYY-MM-DD`).
- Refreshing the browser preserves your active guesses, time, and state.
- Tracks daily win streaks, attempt distribution, and records in `localStorage`.
- Live countdown timer to the next UTC midnight release.

### 2. ↺ Practice Simulator
- Unlimited practice games with freshly randomized unique codes.
- Practice drills never modify your official Daily Challenge streaks or statistics.
- Instant "New Cipher" button for continuous gameplay.

---

## 🎨 Visual & Audio Experience

- **Cyberpunk Terminal Aesthetic**: Deep charcoal background, phosphor neon green, cyan, and cyber amber accents.
- **Synthesized Web Audio Engine**: Zero external audio files or network requests. Synthesizes mechanical key taps, card flip chimes, warning buzzers, and victory arpeggios directly using the Web Audio API.
- **Tile Decryption Flip Animations**: Staggered 3D card flips that reveal feedback sequentially.
- **Terminal Diagnostics Stream**: Retro auto-scrolling system diagnostics and breach telemetry.
- **CRT Scanline Matrix**: Realistic phosphor CRT raster lines with user toggle in Settings.
- **Wordle-Style Share Generator**: Native Web Share API with automatic clipboard fallback and emoji grid.

---

## 📁 Project Architecture

```
password-hacker/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── CharacterCell.jsx       # 3D flip card cell with status glow
│   │   ├── CyberToast.jsx          # Holographic HUD alert notifications
│   │   ├── GameKeyboard.jsx        # 4-row virtual alphanumeric keyboard
│   │   ├── Header.jsx              # Brand header, mode switcher, action buttons
│   │   ├── HowToPlayModal.jsx      # Rules manual with visual color examples
│   │   ├── MissionPanel.jsx        # Target protocol, attempts pips, timer
│   │   ├── PasswordGrid.jsx        # 6x5 attempt decryption grid
│   │   ├── ResultModal.jsx         # Access Granted/Denied, scores, share
│   │   ├── SettingsModal.jsx       # Sound, scanlines, animations, shortcuts
│   │   ├── StatisticsModal.jsx     # Win %, streaks, attempt distribution chart
│   │   └── TerminalLog.jsx         # Scrolling system telemetry stream
│   │
│   ├── game/
│   │   ├── dailyGenerator.js       # Seeded deterministic daily cipher PRNG
│   │   ├── feedback.js             # Pure 2-pass Mastermind feedback algorithm
│   │   ├── gameEngine.js           # Pure game state transitions & keyboard map
│   │   ├── scoring.js              # Score calculation & telemetry metrics
│   │   └── soundEngine.js          # Web Audio API procedural sound synthesizer
│   │
│   ├── hooks/
│   │   ├── useGame.js              # Central game orchestrator hook
│   │   └── useLocalStorage.js      # Resilient localStorage persistence hook
│   │
│   ├── utils/
│   │   ├── dateUtils.js            # UTC date and midnight countdown calculations
│   │   └── shareUtils.js           # Emoji matrix generator & Web Share API
│   │
│   ├── styles/
│   │   ├── global.css              # Variables, resets, typography
│   │   └── game.css                # Complete responsive cyberpunk stylesheet
│   │
│   ├── App.jsx                     # Root application view
│   ├── index.css                   # Stylesheet imports
│   └── main.jsx                    # React 19 entry point
│
├── test-suite.js                   # Automated test suite (17 edge-case tests)
├── index.html                      # HTML5 template with Google fonts
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
# 1. Clone or navigate to the project directory
cd password-hacker

# 2. Install dependencies
npm install

# 3. Start local development server
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

`PASSWORD HACKER` is a 100% client-side Single Page Application (SPA). It requires zero server runtimes, databases, or API keys.

### Deploying to Vercel

#### Method 1: Using the Vercel CLI
```bash
npm install -g vercel
vercel
```

#### Method 2: Git Integration via Vercel Dashboard
1. Push your repository to GitHub / GitLab / Bitbucket.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and import the repository.
3. Configure settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**.

---

### Deploying to Netlify

#### Method 1: Using Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Method 2: Git Integration via Netlify Dashboard
1. Connect your Git repository in [Netlify](https://app.netlify.com).
2. Set build settings:
   - **Base directory**: (leave blank or `./`)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Click **Deploy site**.

#### Client-side Routing Note (`_redirects`)
To support any direct SPA route rewrites on Netlify, an optional `public/_redirects` file can contain:
```
/*    /index.html   200
```

---

## 🛡 License

MIT License. Designed and engineered for maximum immersion and responsive performance.
