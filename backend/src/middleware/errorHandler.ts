import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err: unknown, _req, res, _next) => {
  const status =
    typeof err === 'object' &&
    err !== null &&
    'status' in err &&
    typeof (err as { status?: unknown }).status === 'number'
      ? (err as { status: number }).status
      : 500;
  const message = err instanceof Error ? err.message : 'Internal Server Error';
  res.status(status).json({ error: message });
};
