import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = typeof (err as any)?.status === 'number' ? (err as any).status : 500;
  const message = err instanceof Error ? err.message : 'Internal Server Error';
  res.status(status).json({ error: message });
};
