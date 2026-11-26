import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { toNodeHandler } from 'better-auth/node';
import { env } from './config/env.js';
import { auth } from './config/auth.js';
import routes from './routes/index.js';
import { AppError, pgErrorCode } from './lib/errors.js';

export const app = express();

app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

// Better Auth reads the raw request body, so it has to be mounted before express.json().
app.all('/api/auth/*splat', toNodeHandler(auth));

app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'komisia-api' });
});

app.use('/api', routes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Alamat tidak ditemukan' });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
  } else if (err instanceof multer.MulterError) {
    res.status(400).json({ error: 'File terlalu besar (maksimal 2 MB)' });
  } else if (pgErrorCode(err) === '22P02') {
    // Malformed id in the URL.
    res.status(404).json({ error: 'Data tidak ditemukan' });
  } else {
    console.error('[ERROR]', err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});
