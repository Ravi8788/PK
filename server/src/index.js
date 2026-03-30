import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import portfolioRoutes from './routes/portfolio.js';
import reelsRoutes from './routes/reels.js';
import testimonialsRoutes from './routes/testimonials.js';
import contactsRoutes from './routes/contacts.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/reels', reelsRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/upload', uploadRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
