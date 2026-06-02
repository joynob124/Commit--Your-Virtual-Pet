# Commit — A Virtual Pet That Lives By Your Commit

**Course**: Web Engineering  
**Institution**: Notre Dame University Bangladesh (NDUB)  
**Professor**: Poly Rani Ghosh

## Team Members

- Joynob Bint Jamal
- Syed Nafish Shakir

---

## What is Commit — an Overview

**Commit** is a web-based virtual pet application. The core idea is simple — your pet stays alive as long as you keep committing code to GitHub. Every GitHub commit heals your pet. Neglect it, and its health slowly drains. Spend too long on distracting sites, and your pet loses health even faster.

If health reaches zero, the pet dies permanently, with no way to bring it back, and is memorialized forever in the **Fossil Record**.

Instead of forcing discipline, it creates emotional attachment. Your pet is yours. It has a name you chose, a lifespan you can watch in real time, and a history that survives even after it's gone.

### Core mechanics

| Action | Effect on pet |
|--------|----------------|
| GitHub commits (sync) | Restores health |
| Neglect / time passing | −1 HP every 10 minutes |
| Social media distraction | −1 HP every 10 minutes on tracked sites |
| Health reaches 0 | Pet dies → added to Fossil Record |

---

## Features

- **3D virtual pet** — animated bird with wing flapping, bobbing, and sync celebration animations
- **Low-health behavior** — when health drops below 35%, the pet looks sick (drooping head, shivering, tired eyes, weak wings)
- **GitHub commit sync** — pull recent pushes from your GitHub profile to heal the pet
- **Focus & Distractions dashboard** — live card on the pet page showing wasted time and health lost per site today
- **Distraction log** — full-page breakdown with per-site minutes, HP penalties, and progress bars
- **Chrome extension** — tracks active-tab time on social/media sites and reports penalties to the backend
- **Fossil Record** — memorial gallery for every pet that has died (name, generation, cause of death, lifespan)

---

## User Flow

```
/ (Register or Login)
    │
    └──► /name (Set Pet Name — first time only)
              │
              └──► /pet (Main Pet Home Page)
                        │
                        ├──► /distractions (Distraction Log)
                        │         │
                        │         └──► /pet (Back)
                        │
                        └──► /fossils (Fossil Record)
                                  │
                                  └──► /pet (Back)
```

---

## Pages Overview

### Login

Create an account or sign in with your username and password. Your username should match your **GitHub username** so commit sync can find your public events.

### Name Your Pet

Give your companion a name. It is displayed throughout the app and saved to the fossil record if the pet dies.

### Main Pet View (`/pet`)

Your pet lives here. Monitor health, status, and a live age timer. Use **Sync Commits** to heal from real GitHub activity, or **Simulate Push** for testing.

The **Focus & Distractions** card (left side) shows today's wasted minutes and HP lost per tracked site. Health and distractions refresh automatically every few seconds.

When health is low, the 3D pet reflects it visually.

### Distraction Log (`/distractions`)

A detailed report of today's social media usage: total time wasted, total HP lost, worst offender, and a per-site list with penalties (10 min = −1 HP).

### Fossil Record (`/fossils`)

A memorial page for every pet that has died. Shows name, generation, cause of death, and lifespan.

> *"Commit, or your pet dies."*

---

## Tech Stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React, Vite, React Router, React Three Fiber, Drei, Lucide React |
| Backend | Node.js, Express, SQLite |
| Extension | Chrome Manifest V3 (service worker + popup) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- npm
- Google Chrome or Microsoft Edge (for the extension)

### 1. Install dependencies

```bash
cd Commit
npm install
```

### 2. Run the application

You need **two terminals** open at the same time.

**Terminal 1 — Backend API** (port `3001`):

```bash
npm run server
```

**Terminal 2 — Frontend** (port `5173`):

```bash
npm run dev
```

Open the website: **http://localhost:5173**

### 3. Build for production (optional)

```bash
npm run build
npm run preview
```

The backend (`npm run server`) must still be running for API calls to work.

---

## Browser Extension Setup

The extension tracks time on distracting sites and sends health penalties to your local server.

1. Make sure `npm run server` is running.
2. Open **Chrome** → `chrome://extensions` (or Edge → `edge://extensions`).
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the `browser-extension` folder inside this project.
6. Click the extension icon and log in with the **same account** as the website.
7. Pin the extension from the puzzle-piece menu for quick access.

### Tracked sites

YouTube, Instagram, Facebook, Twitter/X, TikTok, Reddit, Snapchat, Pinterest, Twitch, LinkedIn, Tumblr, Discord, Threads.

### How tracking works

- Checks your active tab about every **30 seconds**.
- Accumulates time only while a tracked site is the **active** tab.
- Sends a penalty for each **10 full minutes** on a site (−1 HP).
- Resets daily counters at midnight.

---

## API Overview (for testing)

Base URL: `http://localhost:3001`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/register` | Create account |
| `POST` | `/api/login` | Sign in |
| `GET` | `/api/pets/:userId` | Get active pet (applies passive decay) |
| `PUT` | `/api/pets/:petId/health` | Update health |
| `POST` | `/api/pets/:petId/sync-github` | Sync GitHub commits |
| `POST` | `/api/pets/:petId/social-penalty` | Apply distraction penalty |
| `GET` | `/api/pets/:petId/social-log` | Today's distraction breakdown |
| `GET` | `/api/fossils/:userId` | List dead pets |

### Quick distraction test (PowerShell)

Replace `2` with your pet ID (check **Application → Local Storage → `petId`** in browser devtools):

```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/pets/2/social-penalty" -Method POST -ContentType "application/json" -Body '{"site":"youtube.com","minutes":10}'
```

Then watch the pet page — health and the distraction card should update within about 10 seconds.

---

## Project Structure

```
Commit/
├── src/                    # React frontend
│   ├── pages/              # Login, PetName, PetPage, DistractionPage, FossilPage
│   └── constants/          # Shared site metadata (icons, labels)
├── server.cjs              # Express API + SQLite
├── database.sqlite         # Local database (created on first run)
├── browser-extension/      # Chrome distraction tracker
│   ├── manifest.json
│   ├── background.js
│   ├── popup.html / popup.js
│   └── domains.js
└── package.json
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `localhost:5173` refused to connect | Run `npm run dev` in a **second** terminal; do not stop it. |
| Login or API errors | Run `npm run server` on port 3001. |
| Extension won't load | Load the `browser-extension` folder (must contain `manifest.json` and `icon.png`). |
| Penalties don't show on website | Use the correct **pet ID** in API tests; log in on the extension with the same account. |
| Refresh on `/distractions` sends you home | Hard refresh after pulling latest code; session is restored from localStorage. |
| GitHub sync fails | Your app username must match your public GitHub username. |

---

## License

Academic project — Notre Dame University Bangladesh, Web Engineering.
