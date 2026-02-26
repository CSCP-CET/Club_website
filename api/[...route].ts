import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../backend/src/server';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // /assets/* is rewritten to /api/assets/*; strip /api so Express static
  // middleware mounted at /assets can match.
  if (typeof req.url === 'string' && req.url.startsWith('/api/assets/')) {
    req.url = req.url.replace('/api', '');
  }

  return app(req, res);
}
