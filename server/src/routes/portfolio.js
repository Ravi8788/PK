import express from 'express';
import { query } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  const result = await query('SELECT * FROM portfolio ORDER BY created_at DESC');
  res.json(result.rows);
});

router.post('/', requireAuth, async (req, res) => {
  const { title, category, description, image_url, media_type } = req.body;
  if (!title || !category || !image_url) {
    return res.status(400).json({ error: 'title, category, image_url are required' });
  }

  const result = await query(
    'INSERT INTO portfolio (title, category, description, image_url, media_type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [title, category, description || null, image_url, media_type || 'image']
  );
  res.status(201).json(result.rows[0]);
});

router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { title, category, description, image_url, media_type } = req.body;
  const result = await query(
    `UPDATE portfolio
     SET title = COALESCE($1, title),
         category = COALESCE($2, category),
         description = COALESCE($3, description),
         image_url = COALESCE($4, image_url),
         media_type = COALESCE($5, media_type)
     WHERE id = $6 RETURNING *`,
    [title, category, description, image_url, media_type, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json(result.rows[0]);
});

router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  await query('DELETE FROM portfolio WHERE id = $1', [id]);
  res.status(204).send();
});

export default router;
