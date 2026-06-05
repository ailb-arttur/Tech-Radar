import express from 'express';
import cors from 'cors';
import newsRouter from './routes/news.js';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/news', newsRouter);

// simple health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Serve static if needed
app.use('/static', express.static(path.join(process.cwd(), 'public')));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`News server listening on http://localhost:${PORT}`);
});
