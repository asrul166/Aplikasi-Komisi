import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { AppError } from './lib/errors.js';

const app = express();

// ── Global Middleware ───────────────────────────────────────────
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health Check ───────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'autocomm-api',
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ─────────────────────────────────────────────────
app.use('/api', routes);

// ── 404 Handler ────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global Error Handler ───────────────────────────────────────
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('[ERROR]', err);

    if (err instanceof AppError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }

    res.status(500).json({
      error: 'Internal server error',
      ...(process.env.NODE_ENV !== 'production' && {
        details: err.message,
      }),
    });
  }
);

// ── Start Server ───────────────────────────────────────────────
app.listen(env.PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║          AutoComm API Server Running             ║
╠══════════════════════════════════════════════════╣
║  Port:    ${String(env.PORT).padEnd(38)}║
║  CORS:    ${env.CORS_ORIGIN.padEnd(38)}║
║  Health:  http://localhost:${env.PORT}/health${' '.repeat(Math.max(0, 18 - String(env.PORT).length))}║
╚══════════════════════════════════════════════════╝
  `);
});

export default app;
