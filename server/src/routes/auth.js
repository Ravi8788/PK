import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email, password are required' });
  }

  const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    return res.status(409).json({ error: 'Email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await query(
    'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
    [name, email, passwordHash]
  );

  const user = result.rows[0];
  const token = signToken(user);
  res.status(201).json({ user, token });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const result = await query('SELECT id, name, email, password_hash FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = signToken(user);
  res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
});

router.get('/me', requireAuth, async (req, res) => {
  const result = await query('SELECT id, name, email FROM users WHERE id = $1', [req.user.id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user: result.rows[0] });
});

export default router;
