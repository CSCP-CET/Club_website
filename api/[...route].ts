import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');
const DATA_ROOT = path.join(PROJECT_ROOT, 'backend', 'src', 'data');
const ASSETS_ROOT = path.join(PROJECT_ROOT, 'backend', 'assets');

const jsonFiles: Record<string, string> = {
  members: 'members.json',
  events: 'events.json',
  timeline: 'timeline.json',
};

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif') return 'image/gif';
  if (ext === '.svg') return 'image/svg+xml';
  return 'application/octet-stream';
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const routeParam = req?.query?.route;
    const routePath = Array.isArray(routeParam)
      ? routeParam.join('/')
      : typeof routeParam === 'string'
        ? routeParam
        : '';

    const pathname = String(req.url || '/').split('?')[0] || '/';
    const fallbackPath = pathname.replace(/^\/api\/?/, '');
    const apiPath = (routePath || fallbackPath).replace(/^\/+/, '');

    if (apiPath in jsonFiles) {
      const filePath = path.join(DATA_ROOT, jsonFiles[apiPath]);
      const raw = await readFile(filePath, 'utf-8');
      return res.status(200).json(JSON.parse(raw));
    }

    const assetRelativePath = apiPath.startsWith('assets/')
      ? apiPath.slice('assets/'.length)
      : apiPath.startsWith('execom/')
        ? apiPath
        : null;

    if (assetRelativePath) {
      const rel = decodeURIComponent(assetRelativePath);
      const target = path.normalize(path.join(ASSETS_ROOT, rel));
      if (!target.startsWith(ASSETS_ROOT)) {
        return res.status(400).json({ error: 'Invalid asset path' });
      }

      let file: Buffer;
      try {
        file = await readFile(target);
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
          return res.status(404).json({ error: `Asset not found: ${rel}` });
        }
        throw err;
      }

      res.setHeader('Content-Type', getMimeType(target));
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.statusCode = 200;
      res.end(file);
      return;
    }

    if (apiPath === 'health' || apiPath === '') {
      return res.status(200).json({ ok: true });
    }

    return res.status(404).json({ error: `Not Found: ${apiPath}` });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown API error';
    return res.status(500).json({ error: message });
  }
}
