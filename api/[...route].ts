import app from '../backend/src/server.js';

export default function handler(req: any, res: any) {
  // /assets/* is rewritten to /api/assets/*; strip /api so Express static
  // middleware mounted at /assets can match.
  if (typeof req.url === 'string' && req.url.startsWith('/api/assets/')) {
    req.url = req.url.replace('/api', '');
  }

  return app(req, res);
}
