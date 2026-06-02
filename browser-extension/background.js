// =============================================
// Commit — Virtual Pet Tracker: background.js
// Monitors active tab for social media usage
// and sends health penalties to the backend.
// =============================================

importScripts('domains.js');

const API_BASE = 'http://localhost:3001';
// Accumulates seconds spent per domain this session
// { 'youtube.com': 120, 'instagram.com': 45, ... }
let sessionTime = {};
let lastActiveUrl = null;
let lastTickTime = null;

// ── Helpers ────────────────────────────────

function getSocialDomain(url) {
  if (!url) return null;
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    return SOCIAL_DOMAINS.find(d => hostname === d || hostname.endsWith('.' + d)) || null;
  } catch {
    return null;
  }
}

async function getPetConfig() {
  return new Promise(resolve => {
    chrome.storage.local.get(['petId', 'userId'], resolve);
  });
}

// ── Main tick: runs every 30 seconds ───────

async function tick() {
  const { petId } = await getPetConfig();
  if (!petId) return; // Not configured yet

  // Get the currently active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url) return;

  const domain = getSocialDomain(tab.url);
  const now = Date.now();

  if (lastActiveUrl && lastTickTime) {
    const prevDomain = getSocialDomain(lastActiveUrl);
    if (prevDomain) {
      const elapsed = Math.round((now - lastTickTime) / 1000); // seconds
      sessionTime[prevDomain] = (sessionTime[prevDomain] || 0) + elapsed;
    }
  }

  lastActiveUrl = tab.url;
  lastTickTime = now;

  // Check all accumulated times — if any domain hit 600s (10 min), send penalty
  for (const [site, seconds] of Object.entries(sessionTime)) {
    const minutes = Math.floor(seconds / 60);
    const penaltyMinutes = Math.floor(minutes / 10) * 10; // round down to nearest 10

    if (penaltyMinutes > 0) {
      // Check if we already reported this threshold
      const storageKey = `reported_${site}`;
      const stored = await new Promise(resolve =>
        chrome.storage.local.get([storageKey], r => resolve(r[storageKey] || 0))
      );

      if (penaltyMinutes > stored) {
        const toReport = penaltyMinutes - stored;
        await sendPenalty(petId, site, toReport);
        await chrome.storage.local.set({ [storageKey]: penaltyMinutes });
      }
    }
  }
}

async function sendPenalty(petId, site, minutes) {
  try {
    const response = await fetch(`${API_BASE}/api/pets/${petId}/social-penalty`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ site, minutes }),
    });
    const data = await response.json();
    console.log(`[PetTracker] Penalty sent: ${data.message}`);

    // Store the last penalty info so popup can show it
    const updates = {
      lastPenalty: { site, minutes, healthLoss: data.healthLoss, newHealth: data.newHealth, time: Date.now() },
    };
    if (data.newHealth !== undefined) {
      updates.petHealth = data.newHealth;
    }
    await chrome.storage.local.set(updates);
  } catch (err) {
    console.warn('[PetTracker] Failed to send penalty:', err.message);
  }
}

// Reset reported thresholds at midnight
function resetDailyCounters() {
  chrome.storage.local.get(null, items => {
    const keysToRemove = Object.keys(items).filter(k => k.startsWith('reported_'));
    if (keysToRemove.length > 0) chrome.storage.local.remove(keysToRemove);
  });
  sessionTime = {};
}

// ── Alarms ─────────────────────────────────

chrome.alarms.create('tick', { periodInMinutes: 0.5 }); // every 30 seconds
chrome.alarms.create('dailyReset', { when: getNextMidnight(), periodInMinutes: 1440 });

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'tick') tick();
  if (alarm.name === 'dailyReset') resetDailyCounters();
});

function getNextMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime();
}

// Run once on startup too
tick();
