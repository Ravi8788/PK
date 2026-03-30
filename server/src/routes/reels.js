import express from 'express';
import { query } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  const result = await query('SELECT * FROM reels ORDER BY created_at DESC');
  res.json(result.rows);
});

router.post('/', requireAuth, async (req, res) => {
  const { title, views, description, thumbnail_url, video_url } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }

  const result = await query(
    'INSERT INTO reels (title, views, description, thumbnail_url, video_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [title, views || null, description || null, thumbnail_url || null, video_url || null]
  );
  res.status(201).json(result.rows[0]);
});

router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { title, views, description, thumbnail_url, video_url } = req.body;
  const result = await query(
    `UPDATE reels
     SET title = COALESCE($1, title),
         views = COALESCE($2, views),
         description = COALESCE($3, description),
         thumbnail_url = COALESCE($4, thumbnail_url),
         video_url = COALESCE($5, video_url)
     WHERE id = $6 RETURNING *`,
    [title, views, description, thumbnail_url, video_url, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json(result.rows[0]);
});

router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  await query('DELETE FROM reels WHERE id = $1', [id]);
  res.status(204).send();
});

export default router;
