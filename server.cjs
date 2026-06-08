const express = require("express");
const { DatabaseSync } = require("node:sqlite");

class ShimDatabase {
  constructor(dbPath, callback) {
    try {
      this.db = new DatabaseSync(dbPath);
      if (callback) process.nextTick(() => callback(null));
    } catch (err) {
      if (callback) process.nextTick(() => callback(err));
    }
  }

  serialize(callback) {
    callback();
  }

  run(sql, params, callback) {
    if (typeof params === "function") {
      callback = params;
      params = [];
    }
    params = params || [];
    try {
      const stmt = this.db.prepare(sql);
      const result = stmt.run(...params);
      if (callback) {
        const context = {
          lastID: result.lastInsertRowid,
          changes: result.changes,
        };
        process.nextTick(() => callback.call(context, null));
      }
    } catch (err) {
      if (callback) process.nextTick(() => callback(err));
    }
    return this;
  }

  get(sql, params, callback) {
    if (typeof params === "function") {
      callback = params;
      params = [];
    }
    params = params || [];
    try {
      const stmt = this.db.prepare(sql);
      const row = stmt.get(...params);
      if (callback) process.nextTick(() => callback(null, row));
    } catch (err) {
      if (callback) process.nextTick(() => callback(err));
    }
    return this;
  }

  all(sql, params, callback) {
    if (typeof params === "function") {
      callback = params;
      params = [];
    }
    params = params || [];
    try {
      const stmt = this.db.prepare(sql);
      const rows = stmt.all(...params);
      if (callback) process.nextTick(() => callback(null, rows));
    } catch (err) {
      if (callback) process.nextTick(() => callback(err));
    }
    return this;
  }
}

const sqlite3 = {
  verbose() {
    return this;
  },
  Database: ShimDatabase,
};
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();
const PORT = 3001;

// Health decay rate: 2 health points lost per hour
const HEALTH_DECAY_PER_HOUR = 2;

// Species & color themes — keep in sync with src/constants/petCatalog.json
const petCatalog = require("./src/constants/petCatalog.json");
const PET_TYPES_LIST = petCatalog.species;
const PET_THEMES_LIST = petCatalog.themes;

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - chroma / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) {
    r = chroma;
    g = x;
  } else if (h < 120) {
    r = x;
    g = chroma;
  } else if (h < 180) {
    g = chroma;
    b = x;
  } else if (h < 240) {
    g = x;
    b = chroma;
  } else if (h < 300) {
    r = x;
    b = chroma;
  } else {
    r = chroma;
    b = x;
  }
  const toHex = (v) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function generateRandomColors() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 58 + Math.floor(Math.random() * 32);
  const lightness = 48 + Math.floor(Math.random() * 18);
  return {
    base: hslToHex(hue, saturation, lightness),
    sick: hslToHex(
      hue,
      Math.max(22, saturation - 28),
      Math.max(30, lightness - 20),
    ),
  };
}

function pickRandomAppearance() {
  const colors = generateRandomColors();
  return {
    petType: PET_TYPES_LIST[Math.floor(Math.random() * PET_TYPES_LIST.length)],
    themeIndex: Math.floor(Math.random() * PET_THEMES_LIST.length),
    petColor: colors.base,
    petColorSick: colors.sick,
  };
}

function ensurePetColors(pet, callback) {
  if (pet.pet_color) return callback(pet);
  const colors = generateRandomColors();
  db.run(
    "UPDATE pets SET pet_color = ?, pet_color_sick = ? WHERE id = ?",
    [colors.base, colors.sick, pet.id],
    (err) => {
      if (err) console.error("Error assigning pet colors:", err.message);
      callback({ ...pet, pet_color: colors.base, pet_color_sick: colors.sick });
    },
  );
}

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database");
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
      (err) => {
        if (err) console.error("Error creating users table:", err.message);
      },
    );

    // Pets table
    db.run(
      `CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      health INTEGER DEFAULT 100,
      birth_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_health_update DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_github_event_id TEXT,
      is_alive INTEGER DEFAULT 1,
      pet_type TEXT DEFAULT 'bird',
      theme_index INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`,
      (err) => {
        if (err) console.error("Error creating pets table:", err.message);
      },
    );

    // Migration: add last_health_update column to existing pets table
    db.run(
      `ALTER TABLE pets ADD COLUMN last_health_update DATETIME DEFAULT CURRENT_TIMESTAMP`,
      (err) => {
        // Ignore error if column already exists
        if (err && !err.message.includes("duplicate column")) {
          console.error("Migration error:", err.message);
        }
      },
    );

    // Fossils table (dead pets)
    db.run(
      `CREATE TABLE IF NOT EXISTS fossils (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pet_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      generation INTEGER DEFAULT 1,
      birth_date DATETIME NOT NULL,
      death_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      cause_of_death TEXT,
      days_lived INTEGER,
      total_commits INTEGER DEFAULT 0,
      FOREIGN KEY (pet_id) REFERENCES pets(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`,
      (err) => {
        if (err) console.error("Error creating fossils table:", err.message);
      },
    );

    // Social media distraction log table
    db.run(
      `CREATE TABLE IF NOT EXISTS social_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pet_id INTEGER NOT NULL,
      site TEXT NOT NULL,
      minutes INTEGER NOT NULL,
      health_penalty INTEGER NOT NULL,
      logged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pet_id) REFERENCES pets(id)
    )`,
      (err) => {
        if (err) console.error("Error creating social_log table:", err.message);
      },
    );

    // Migration: add last_github_event_id column if not exists
    db.run(`ALTER TABLE pets ADD COLUMN last_github_event_id TEXT`, (err) => {
      if (err && !err.message.includes("duplicate column")) {
        console.error("Migration error (last_github_event_id):", err.message);
      }
    });

    // Migration: add pet_type and theme_index columns if not exists
    db.run(
      `ALTER TABLE pets ADD COLUMN pet_type TEXT DEFAULT 'bird'`,
      (err) => {
        if (err && !err.message.includes("duplicate column")) {
          console.error("Migration error (pet_type):", err.message);
        }
      },
    );
    db.run(
      `ALTER TABLE pets ADD COLUMN theme_index INTEGER DEFAULT 0`,
      (err) => {
        if (err && !err.message.includes("duplicate column")) {
          console.error("Migration error (theme_index):", err.message);
        }
      },
    );
    db.run(`ALTER TABLE pets ADD COLUMN pet_color TEXT`, (err) => {
      if (err && !err.message.includes("duplicate column")) {
        console.error("Migration error (pet_color):", err.message);
      }
    });
    db.run(`ALTER TABLE pets ADD COLUMN pet_color_sick TEXT`, (err) => {
      if (err && !err.message.includes("duplicate column")) {
        console.error("Migration error (pet_color_sick):", err.message);
      }
    });
  });
}

// Register endpoint
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword],
      function (err) {
        if (err) {
          if (err.message.includes("UNIQUE constraint")) {
            return res.status(409).json({ error: "Username already exists" });
          }
          return res.status(500).json({ error: "Database error" });
        }
        res.json({
          success: true,
          userId: this.lastID,
          username: username,
        });
      },
    );
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      try {
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        // Check if user has an active pet
        db.get(
          "SELECT * FROM pets WHERE user_id = ? AND is_alive = 1",
          [user.id],
          (err, pet) => {
            if (err) {
              return res.status(500).json({ error: "Database error" });
            }

            res.json({
              success: true,
              userId: user.id,
              username: user.username,
              petName: pet ? pet.name : null,
              petId: pet ? pet.id : null,
            });
          },
        );
      } catch (error) {
        res.status(500).json({ error: "Server error" });
      }
    },
  );
});

// Create pet endpoint
app.post("/api/pets", (req, res) => {
  const { userId, name } = req.body;

  if (!userId || !name) {
    return res.status(400).json({ error: "User ID and pet name are required" });
  }

  // Verify the user exists first (prevents Foreign Key violations on database reset)
  db.get("SELECT id FROM users WHERE id = ?", [userId], (err, userRow) => {
    if (err) {
      console.error("Verify user error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (!userRow) {
      return res
        .status(401)
        .json({
          error: "User session invalid. Please log out and register again.",
        });
    }

    // Get generation number for this user
    db.get(
      "SELECT COUNT(*) as count FROM fossils WHERE user_id = ?",
      [userId],
      (err, result) => {
        if (err) {
          console.error("Fossils select error:", err);
          return res.status(500).json({ error: "Database error" });
        }

        const generation = (result?.count || 0) + 1;

        const appearance = pickRandomAppearance();

        db.run(
          "INSERT INTO pets (user_id, name, health, birth_date, last_health_update, is_alive, pet_type, theme_index, pet_color, pet_color_sick) VALUES (?, ?, 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, ?, ?, ?, ?)",
          [
            userId,
            name,
            appearance.petType,
            appearance.themeIndex,
            appearance.petColor,
            appearance.petColorSick,
          ],
          function (err) {
            if (err) {
              console.error("Pets insert error:", err);
              return res.status(500).json({ error: "Database error" });
            }
            res.json({
              success: true,
              petId: this.lastID,
              name: name,
              generation: generation,
              petType: appearance.petType,
              themeIndex: appearance.themeIndex,
              petColor: appearance.petColor,
              petColorSick: appearance.petColorSick,
            });
          },
        );
      },
    );
  });
});

// Helper: kill a pet and create a fossil record
function killPet(pet, causeOfDeath, callback) {
  const daysLived = Math.floor(
    (Date.now() - new Date(pet.birth_date + "Z").getTime()) /
      (1000 * 60 * 60 * 24),
  );
  db.run(
    "INSERT INTO fossils (pet_id, user_id, name, birth_date, death_date, cause_of_death, days_lived) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)",
    [pet.id, pet.user_id, pet.name, pet.birth_date, causeOfDeath, daysLived],
    (err) => {
      if (err) console.error("Error creating fossil:", err.message);
      db.run(
        "UPDATE pets SET is_alive = 0, health = 0 WHERE id = ?",
        [pet.id],
        (err) => {
          if (err) console.error("Error marking pet as dead:", err.message);
          if (callback) callback();
        },
      );
    },
  );
}

// Get pet data endpoint — applies passive health decay
app.get("/api/pets/:userId", (req, res) => {
  const { userId } = req.params;

  db.get(
    "SELECT * FROM pets WHERE user_id = ? AND is_alive = 1",
    [userId],
    (err, pet) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      if (!pet) {
        return res.status(404).json({ error: "No active pet found" });
      }

      // Calculate health decay since last update
      const lastUpdate = new Date(pet.last_health_update + "Z").getTime();
      const now = Date.now();
      const secondsPassed = (now - lastUpdate) / 1000;
      const decay = Math.floor(secondsPassed / 600); // lose 1 health point every 10 minutes

      const respond = (petRow) => {
        ensurePetColors(petRow, (withColors) => res.json(withColors));
      };

      if (decay > 0) {
        const newHealth = Math.max(0, pet.health - decay);

        // Update DB with decayed health and reset timer
        db.run(
          "UPDATE pets SET health = ?, last_health_update = CURRENT_TIMESTAMP WHERE id = ?",
          [newHealth, pet.id],
          (err) => {
            if (err)
              console.error("Error updating decayed health:", err.message);

            // Pet died from neglect
            if (newHealth <= 0) {
              killPet(pet, "Neglected — health decayed to zero", () => {
                respond({ ...pet, health: 0, is_alive: 0 });
              });
            } else {
              respond({
                ...pet,
                health: newHealth,
                last_health_update: new Date().toISOString(),
              });
            }
          },
        );
      } else {
        respond(pet);
      }
    },
  );
});

// Update pet health endpoint
app.put("/api/pets/:petId/health", (req, res) => {
  const { petId } = req.params;
  const { health } = req.body;

  if (health === undefined || health === null) {
    return res.status(400).json({ error: "Health value is required" });
  }

  db.run(
    "UPDATE pets SET health = ?, last_health_update = CURRENT_TIMESTAMP WHERE id = ?",
    [health, petId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Pet not found" });
      }

      // Check if pet died
      if (health <= 0) {
        db.get("SELECT * FROM pets WHERE id = ?", [petId], (err, pet) => {
          if (err || !pet) return;
          killPet(pet, "Neglected — health reached zero");
        });
      }

      res.json({ success: true, health: health });
    },
  );
});

// Sync pet health with GitHub commits (HEAL IT FULL!)
app.post("/api/pets/:petId/sync-github", async (req, res) => {
  const { petId } = req.params;
  const { simulate } = req.body;

  db.get(
    "SELECT pets.*, users.username FROM pets JOIN users ON pets.user_id = users.id WHERE pets.id = ?",
    [petId],
    async (err, pet) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      if (!pet) {
        return res.status(404).json({ error: "Pet not found" });
      }

      if (pet.is_alive === 0) {
        return res.status(400).json({ error: "Pet is already dead" });
      }

      // Simulation mode: immediately heal pet full
      if (simulate) {
        const newHealth = 100;
        db.run(
          "UPDATE pets SET health = ?, last_health_update = CURRENT_TIMESTAMP WHERE id = ?",
          [newHealth, petId],
          (err) => {
            if (err) return res.status(500).json({ error: "Database error" });
            return res.json({
              success: true,
              healed: true,
              newCommits: 1,
              health: newHealth,
              message:
                "Simulated Commit: Code pushed! Pet fully healed to 100%! 🩹🎉",
            });
          },
        );
        return;
      }

      try {
        // Fetch events from GitHub API
        const githubResponse = await fetch(
          `https://api.github.com/users/${pet.username}/events`,
          {
            headers: {
              "User-Agent": "commit-my-pet",
            },
          },
        );

        if (!githubResponse.ok) {
          if (githubResponse.status === 404) {
            return res
              .status(404)
              .json({ error: `GitHub username @${pet.username} not found.` });
          }
          return res
            .status(502)
            .json({ error: "Failed to fetch events from GitHub." });
        }

        const events = await githubResponse.json();

        // Find only the single latest PushEvent — this is our watermark
        const latestPush = Array.isArray(events)
          ? events.find((e) => e.type === "PushEvent")
          : null;

        if (!latestPush) {
          return res.json({
            success: true,
            healed: false,
            newCommits: 0,
            health: pet.health,
            message: "No commits found on GitHub! Start pushing code! 💻",
          });
        }

        // If the latest push ID matches what we already stored — no new commit
        if (pet.last_github_event_id === latestPush.id) {
          return res.json({
            success: true,
            healed: false,
            newCommits: 0,
            health: pet.health,
            message:
              "No new commits since your last sync! Keep committing on GitHub! 💻",
          });
        }

        // New push detected — heal pet fully and save this event ID as the new watermark
        const newHealth = 100;
        db.run(
          "UPDATE pets SET health = ?, last_health_update = CURRENT_TIMESTAMP, last_github_event_id = ? WHERE id = ?",
          [newHealth, latestPush.id, petId],
          (err) => {
            if (err) return res.status(500).json({ error: "Database error" });
            return res.json({
              success: true,
              healed: true,
              newCommits: 1,
              health: newHealth,
              message:
                "New commit detected on GitHub! Pet fully healed to 100%! 🩹🎉",
            });
          },
        );
      } catch (error) {
        console.error("GitHub sync error:", error);
        return res
          .status(500)
          .json({ error: "Server error during GitHub sync" });
      }
    },
  );
});

// Get fossils endpoint
app.get("/api/fossils/:userId", (req, res) => {
  const { userId } = req.params;

  db.all(
    "SELECT * FROM fossils WHERE user_id = ? ORDER BY death_date DESC",
    [userId],
    (err, fossils) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      res.json(fossils);
    },
  );
});

// Social media penalty endpoint — called by Chrome extension
app.post("/api/pets/:petId/social-penalty", (req, res) => {
  const { petId } = req.params;
  const { site, minutes } = req.body;

  if (!site || !minutes || minutes <= 0) {
    return res.status(400).json({ error: "site and minutes are required" });
  }

  // 10 minutes on social media = -1 health
  const healthLoss = Math.floor(minutes / 10);
  if (healthLoss === 0) {
    return res.json({
      success: true,
      message: "Not enough time yet to penalize.",
    });
  }

  db.get(
    "SELECT * FROM pets WHERE id = ? AND is_alive = 1",
    [petId],
    (err, pet) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (!pet) return res.status(404).json({ error: "Pet not found" });

      const newHealth = Math.max(0, pet.health - healthLoss);

      db.run(
        "UPDATE pets SET health = ?, last_health_update = CURRENT_TIMESTAMP WHERE id = ?",
        [newHealth, petId],
        (err) => {
          if (err) return res.status(500).json({ error: "Database error" });

          // Log the distraction
          db.run(
            "INSERT INTO social_log (pet_id, site, minutes, health_penalty) VALUES (?, ?, ?, ?)",
            [petId, site, minutes, healthLoss],
            (err) => {
              if (err)
                console.error("Error logging social penalty:", err.message);
            },
          );

          if (newHealth <= 0) {
            killPet(pet, `Distracted by ${site} — health drained to zero`);
          }

          return res.json({
            success: true,
            site,
            minutes,
            healthLoss,
            newHealth,
            message: `${minutes} min on ${site} → -${healthLoss} health 😔`,
          });
        },
      );
    },
  );
});

// Get today's social media distraction log for a pet
app.get("/api/pets/:petId/social-log", (req, res) => {
  const { petId } = req.params;

  db.all(
    `SELECT site, SUM(minutes) as total_minutes, SUM(health_penalty) as total_penalty
     FROM social_log
     WHERE pet_id = ? AND DATE(logged_at) = DATE('now')
     GROUP BY site
     ORDER BY total_minutes DESC`,
    [petId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(rows || []);
    },
  );
});

// Get leaderboard endpoint
app.get("/api/leaderboard", (req, res) => {
  db.all(
    `SELECT pets.id, pets.name, pets.health, pets.birth_date, pets.pet_type, pets.theme_index, pets.pet_color, pets.pet_color_sick, users.username
     FROM pets
     JOIN users ON pets.user_id = users.id
     WHERE pets.is_alive = 1
     ORDER BY pets.health DESC, pets.birth_date ASC`,
    [],
    (err, pets) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      // Calculate days lived for each pet
      const petsWithAge = (pets || []).map((pet) => {
        const birthDate = new Date(pet.birth_date);
        const now = new Date();
        const diffMs = now - birthDate;
        const daysLived = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hoursLived = Math.floor(
          (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutesLived = Math.floor(
          (diffMs % (1000 * 60 * 60)) / (1000 * 60),
        );
        return {
          ...pet,
          days_lived: daysLived,
          hours_lived: hoursLived,
          minutes_lived: minutesLived,
        };
      });
      res.json(petsWithAge);
    },
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
