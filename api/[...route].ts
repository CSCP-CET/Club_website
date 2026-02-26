import { readFile } from 'node:fs/promises';
import path from 'node:path';

const DATA_ROOT = path.join(process.cwd(), 'backend', 'src', 'data');
const ASSETS_ROOT = path.join(process.cwd(), 'backend', 'assets');

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

    const pathname = String(req.url || '/').split('?')[0] || '/';
    const apiPath = pathname.replace(/^\/api\/?/, '');

    if (apiPath in jsonFiles) {
      const filePath = path.join(DATA_ROOT, jsonFiles[apiPath]);
      const raw = await readFile(filePath, 'utf-8');
      return res.status(200).json(JSON.parse(raw));
    }

    if (apiPath.startsWith('assets/')) {
      const rel = decodeURIComponent(apiPath.slice('assets/'.length));
      const target = path.normalize(path.join(ASSETS_ROOT, rel));
      if (!target.startsWith(ASSETS_ROOT)) {
        return res.status(400).json({ error: 'Invalid asset path' });
      }

      const file = await readFile(target);
      res.setHeader('Content-Type', getMimeType(target));
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.status(200).send(file);
    }

    if (apiPath === 'health' || apiPath === '') {
      return res.status(200).json({ ok: true });
    }

    return res.status(404).json({ error: 'Not Found' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown API error';
    return res.status(500).json({ error: message });
  }
}
