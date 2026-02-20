import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import componentRoutes from './routes/components.routes';

const app = express();
const PORT = process.env.PORT ?? 4000;

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  })
);

// ── Rate limiting ─────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({ windowMs: 60_000, max: 120, standardHeaders: true });
app.use(globalLimiter);

// Tracking ingestion gets a generous limit to handle SDK bursts
const trackLimiter = rateLimit({ windowMs: 60_000, max: 1000, standardHeaders: true });
app.use('/api/components/track', trackLimiter);

// ── Parsing & logging ─────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/components', componentRoutes);

app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', ts: new Date().toISOString() })
);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[error]', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Boot ──────────────────────────────────────────────────────────────────────
(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[server] Running on http://localhost:${PORT}`);
  });
})();

export default app;
