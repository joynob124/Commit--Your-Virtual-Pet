import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) console.error('Error creating users table:', err.message);
    });

    // Pets table
    db.run(`CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      health INTEGER DEFAULT 100,
      birth_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_health_update DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_github_event_id TEXT,
      is_alive INTEGER DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`, (err) => {
      if (err) console.error('Error creating pets table:', err.message);
    });

    // Fossils table (dead pets)
    db.run(`CREATE TABLE IF NOT EXISTS fossils (
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
    )`, (err) => {
      if (err) console.error('Error creating fossils table:', err.message);
    });
  });
}

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint')) {
            return res.status(409).json({ error: 'Username already exists' });
          }
          return res.status(500).json({ error: 'Database error' });
        }
        res.json({ 
          success: true, 
          userId: this.lastID,
          username: username 
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  db.get(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      try {
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if user has an active pet
        db.get(
          'SELECT * FROM pets WHERE user_id = ? AND is_alive = 1',
          [user.id],
          (err, pet) => {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }

            res.json({
              success: true,
              userId: user.id,
              username: user.username,
              petName: pet ? pet.name : null,
              petId: pet ? pet.id : null
            });
          }
        );
      } catch (error) {
        res.status(500).json({ error: 'Server error' });
      }
    }
  );
});

// Create pet endpoint
app.post('/api/pets', (req, res) => {
  const { userId, name } = req.body;

  if (!userId || !name) {
    return res.status(400).json({ error: 'User ID and pet name are required' });
  }

  // Get generation number for this user
  db.get(
    'SELECT COUNT(*) as count FROM fossils WHERE user_id = ?',
    [userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      const generation = (result.count || 0) + 1;

      db.run(
        'INSERT INTO pets (user_id, name, health, birth_date, is_alive) VALUES (?, ?, 100, CURRENT_TIMESTAMP, 1)',
        [userId, name],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          res.json({
            success: true,
            petId: this.lastID,
            name: name,
            generation: generation
          });
        }
      );
    }
  );
});

// Get pet data endpoint
app.get('/api/pets/:userId', (req, res) => {
  const { userId } = req.params;

  db.get(
    'SELECT * FROM pets WHERE user_id = ? AND is_alive = 1',
    [userId],
    (err, pet) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!pet) {
        return res.status(404).json({ error: 'No active pet found' });
      }

      res.json(pet);
    }
  );
});

// Update pet health endpoint
app.put('/api/pets/:petId/health', (req, res) => {
  const { petId } = req.params;
  const { health } = req.body;

  if (health === undefined || health === null) {
    return res.status(400).json({ error: 'Health value is required' });
  }

  db.run(
    'UPDATE pets SET health = ? WHERE id = ?',
    [health, petId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Pet not found' });
      }

      // Check if pet died
      if (health <= 0) {
        db.get(
          'SELECT * FROM pets WHERE id = ?',
          [petId],
          (err, pet) => {
            if (err || !pet) return;

            // Move to fossils
            const daysLived = Math.floor((new Date() - new Date(pet.birth_date)) / (1000 * 60 * 60 * 24));
            
            db.run(
              'INSERT INTO fossils (pet_id, user_id, name, birth_date, death_date, cause_of_death, days_lived) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, "Neglected - health reached zero", ?)',
              [pet.id, pet.user_id, pet.name, pet.birth_date, daysLived],
              (err) => {
                if (err) console.error('Error creating fossil:', err.message);
                
                // Mark pet as dead
                db.run(
                  'UPDATE pets SET is_alive = 0 WHERE id = ?',
                  [petId],
                  (err) => {
                    if (err) console.error('Error marking pet as dead:', err.message);
                  }
                );
              }
            );
          }
        );
      }

      res.json({ success: true, health: health });
    }
  );
});

// Get fossils endpoint
app.get('/api/fossils/:userId', (req, res) => {
  const { userId } = req.params;

  db.all(
    'SELECT * FROM fossils WHERE user_id = ? ORDER BY death_date DESC',
    [userId],
    (err, fossils) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json(fossils);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
