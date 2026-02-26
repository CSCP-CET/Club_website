export default async function handler(req: any, res: any) {
  try {
    const mod = await import('../backend/src/server');
    const app = mod.default;

    // /assets/* is rewritten to /api/assets/*; strip /api so Express static
    // middleware mounted at /assets can match.
    if (typeof req.url === 'string' && req.url.startsWith('/api/assets/')) {
      req.url = req.url.replace('/api', '');
    }

    return app(req, res);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown function bootstrap error';
    return res.status(500).json({ error: `API bootstrap failed: ${message}` });
  }
}
