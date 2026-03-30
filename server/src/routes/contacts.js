import express from 'express';
import { query } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email, message are required' });
  }

  const result = await query(
    'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *',
    [name, email, message]
  );

  res.status(201).json(result.rows[0]);
});

router.get('/', requireAuth, async (_req, res) => {
  const result = await query('SELECT * FROM contacts ORDER BY created_at DESC');
  res.json(result.rows);
});

export default router;
