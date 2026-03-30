import express from 'express';
import { query } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  const result = await query('SELECT * FROM testimonials ORDER BY created_at DESC');
  res.json(result.rows);
});

router.post('/', requireAuth, async (req, res) => {
  const { client_name, project_type, text, rating, client_image } = req.body;
  if (!client_name || !text || !rating) {
    return res.status(400).json({ error: 'client_name, text, rating are required' });
  }

  const result = await query(
    'INSERT INTO testimonials (client_name, project_type, text, rating, client_image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [client_name, project_type || null, text, Number(rating), client_image || null]
  );
  res.status(201).json(result.rows[0]);
});

router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { client_name, project_type, text, rating, client_image } = req.body;
  const result = await query(
    `UPDATE testimonials
     SET client_name = COALESCE($1, client_name),
         project_type = COALESCE($2, project_type),
         text = COALESCE($3, text),
         rating = COALESCE($4, rating),
         client_image = COALESCE($5, client_image)
     WHERE id = $6 RETURNING *`,
    [client_name, project_type, text, rating, client_image, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json(result.rows[0]);
});

router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  await query('DELETE FROM testimonials WHERE id = $1', [id]);
  res.status(204).send();
});

export default router;
