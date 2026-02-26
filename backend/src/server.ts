import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import apiRouter from './routes/api.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

const port = Number(process.env.PORT ?? 3000);
const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:5173';

const rateLimitWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
const rateLimitMax = Number(process.env.RATE_LIMIT_MAX ?? 120);

const app = express();

app.use((req: any, res: any, next: any) => {
  if (req.headers['x-original-path']) {
    const original = req.headers['x-original-path'] as string;
    if (original.startsWith('/api')) {
      req.url = original.replace('/api', '');
    } else {
      req.url = original;
    }
  }
  next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.disable('x-powered-by');

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

app.use(
  cors({
    origin: corsOrigin,
    methods: ['GET'],
  }),
);

app.use(
  rateLimit({
    windowMs: rateLimitWindowMs,
    limit: rateLimitMax,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  }),
);

app.get('/health', (_req: any, res: any) => {
  res.status(200).json({ ok: true });
});

app.use(
  '/assets',
  express.static(path.join(__dirname, '..', 'assets'), {
    fallthrough: false,
    maxAge: '1h',
  }),
);

app.use('/api', apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

// export the app instance so Vercel (or other serverless hosts)
// can wrap it in a lambda handler. When running locally we start
// the listener explicitly.
export default app;

if (process.env.VERCEL === undefined) {
  app.listen(port, () => {
    // Intentionally no extra logging beyond address/port
    // eslint-disable-next-line no-console
    console.log(`Backend listening on http://localhost:${port}`);
  });
}
