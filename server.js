require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files using __dirname so it works on Vercel too
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiter — max 10 contact submissions per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many requests, please try again later.' }
});

// Neon DB connection (lazy — only used when a request hits /api/contact)
let sql;
function getDB() {
  if (!sql) sql = neon(process.env.DATABASE_URL);
  return sql;
}

// Ensure messages table exists
async function initDB() {
  const db = getDB();
  await db`
    CREATE TABLE IF NOT EXISTS messages (
      id         SERIAL PRIMARY KEY,
      name       TEXT        NOT NULL,
      email      TEXT        NOT NULL,
      message    TEXT        NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

// POST /api/contact — save a contact form submission
app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  try {
    const db = getDB();
    await initDB();
    await db`
      INSERT INTO messages (name, email, message)
      VALUES (${name.trim()}, ${email.trim()}, ${message.trim()})
    `;
    return res.status(201).json({ success: true, message: 'Message saved successfully!' });
  } catch (err) {
    console.error('DB error:', err);
    return res.status(500).json({ error: 'Failed to save message. Please try again.' });
  }
});

// Fallback — serve index.html for any unmatched route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Only listen when running locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
