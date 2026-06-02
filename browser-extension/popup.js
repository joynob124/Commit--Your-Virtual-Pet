const API_BASE = 'http://localhost:3001';

const SITE_ICONS = {
  'youtube.com': '📺',
  'instagram.com': '📸',
  'facebook.com': '👤',
  'twitter.com': '🐦',
  'x.com': '🐦',
  'tiktok.com': '🎵',
  'reddit.com': '👽',
  'snapchat.com': '👻',
  'pinterest.com': '📌',
  'twitch.tv': '🎮',
  'linkedin.com': '💼',
  'tumblr.com': '📝',
  'discord.com': '💬',
  'threads.net': '🧵',
};

function getStatusLabel(health) {
  if (health >= 80) return '🌟 Thriving!';
  if (health >= 60) return '😊 Happy';
  if (health >= 40) return '😐 Okay';
  if (health >= 20) return '😟 Sad';
  if (health > 0)  return '🚨 Critical!';
  return '💀 Dead';
}

function getHealthColor(health) {
  if (health >= 60) return 'linear-gradient(90deg, #7c3aed, #a855f7)';
  if (health >= 30) return '#fbbf24';
  return '#f87171';
}

async function loadMainScreen(petId, username) {
  // Show pet info from storage
  const storage = await chrome.storage.local.get(['petName', 'petHealth', 'lastPenalty']);
  const petName = storage.petName || 'Your Pet';
  const health = storage.petHealth ?? 100;

  document.getElementById('petName').textContent = petName;
  document.getElementById('usernameLabel').textContent = `@${username}`;
  document.getElementById('healthValue').textContent = `${Math.round(health)}%`;

  const bar = document.getElementById('healthBar');
  bar.style.width = `${health}%`;
  bar.style.background = getHealthColor(health);

  document.getElementById('statusBadge').textContent = getStatusLabel(health);

  // Show last penalty if recent (within last 5 min)
  const lastPenalty = storage.lastPenalty;
  const penaltyEl = document.getElementById('lastPenalty');
  if (lastPenalty && Date.now() - lastPenalty.time < 5 * 60 * 1000) {
    const icon = SITE_ICONS[lastPenalty.site] || '📵';
    document.getElementById('lastPenaltyText').textContent =
      `${icon} Last: ${lastPenalty.minutes}min on ${lastPenalty.site} → -${lastPenalty.healthLoss} health`;
    penaltyEl.style.display = 'block';
  } else {
    penaltyEl.style.display = 'none';
  }

  // Fetch today's distractions
  await loadDistractions(petId);
}

async function loadDistractions(petId) {
  try {
    const res = await fetch(`${API_BASE}/api/pets/${petId}/social-log`);
    const logs = await res.json();
    const container = document.getElementById('distractionList');

    if (!logs || logs.length === 0) {
      container.innerHTML = '<div class="empty-msg">No distractions today! 🎉</div>';
      return;
    }

    container.innerHTML = logs.map(log => {
      const icon = SITE_ICONS[log.site] || '📵';
      const mins = log.total_minutes;
      const penalty = log.total_penalty;
      return `
        <div class="distraction-row">
          <span class="distraction-site">${icon} ${log.site}</span>
          <span class="distraction-meta">
            <span class="distraction-time">${mins}m</span>
            <span class="distraction-penalty">-${penalty} hp</span>
          </span>
        </div>`;
    }).join('');
  } catch (e) {
    document.getElementById('distractionList').innerHTML =
      '<div class="empty-msg">Server offline</div>';
  }
}

async function refreshHealth(petId, userId) {
  try {
    const res = await fetch(`${API_BASE}/api/pets/${userId}`);
    const pet = await res.json();
    if (pet && pet.health !== undefined) {
      await chrome.storage.local.set({ petHealth: pet.health, petName: pet.name });
    }
  } catch(e) {}
}

// ── Init ────────────────────────────────────

async function init() {
  const stored = await chrome.storage.local.get(['petId', 'userId', 'username', 'petName']);

  if (stored.petId && stored.userId) {
    // Already logged in
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainScreen').style.display = 'block';
    await refreshHealth(stored.petId, stored.userId);
    await loadMainScreen(stored.petId, stored.username);
  }

  // Login button
  document.getElementById('loginBtn').addEventListener('click', async () => {
    const username = document.getElementById('usernameInput').value.trim();
    const password = document.getElementById('passwordInput').value;
    const errEl = document.getElementById('loginError');
    errEl.textContent = '';

    if (!username || !password) {
      errEl.textContent = 'Please fill in both fields.';
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        errEl.textContent = data.error || 'Login failed.';
        return;
      }

      if (!data.petId) {
        errEl.textContent = 'No active pet found. Create one first!';
        return;
      }

      await chrome.storage.local.set({
        petId: String(data.petId),
        userId: String(data.userId),
        username: data.username,
        petName: data.petName || 'Your Pet',
        petHealth: 100,
      });

      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('mainScreen').style.display = 'block';
      await refreshHealth(String(data.petId), String(data.userId));
      await loadMainScreen(String(data.petId), data.username);
    } catch (e) {
      errEl.textContent = 'Cannot connect to server. Is it running?';
    }
  });

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await chrome.storage.local.clear();
    document.getElementById('mainScreen').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('usernameInput').value = '';
    document.getElementById('passwordInput').value = '';
  });

  // Refresh
  document.getElementById('refreshBtn').addEventListener('click', async () => {
    const s = await chrome.storage.local.get(['petId', 'userId', 'username']);
    if (s.petId) {
      await refreshHealth(s.petId, s.userId);
      await loadMainScreen(s.petId, s.username);
    }
  });

  // Enter key on login
  document.getElementById('passwordInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('loginBtn').click();
  });
}

document.addEventListener('DOMContentLoaded', init);
