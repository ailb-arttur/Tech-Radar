import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

const DATA_PATH = path.join(process.cwd(), 'server', 'data', 'news.json');

function readNews() {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    const items = JSON.parse(raw);
    return items;
  } catch (err) {
    console.error('Failed to read news data', err);
    return [];
  }
}

// GET /api/news?limit=10
router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit || '10', 10) || 10;
  const news = readNews();
  // simple sorting by provided date string unchanged; keep order
  res.json(news.slice(0, limit));
});

export default router;
