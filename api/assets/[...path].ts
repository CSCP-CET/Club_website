import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const PROJECT_ROOT = process.cwd();
const ASSET_ROOT_CANDIDATES = [
  path.join(PROJECT_ROOT, 'backend', 'assets'),
  path.join(PROJECT_ROOT, '..', 'backend', 'assets'),
  path.join('/var/task', 'backend', 'assets'),
  path.join('/var/task/user', 'backend', 'assets'),
];

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif') return 'image/gif';
  if (ext === '.svg') return 'image/svg+xml';
  return 'application/octet-stream';
}

async function pathExists(target: string): Promise<boolean> {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

async function findFileCaseInsensitive(root: string, relPath: string): Promise<string | null> {
  const segments = relPath.split('/').filter(Boolean);
  let current = root;

  for (const segment of segments) {
    let entries: string[];
    try {
      entries = await readdir(current);
    } catch {
      return null;
    }
    const next = entries.find((name) => name.toLowerCase() === segment.toLowerCase());
    if (!next) return null;
    current = path.join(current, next);
  }

  return current;
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const routeParam = req?.query?.path;
    const routePath = Array.isArray(routeParam)
      ? routeParam.join('/')
      : typeof routeParam === 'string'
        ? routeParam
        : '';
    const rel = decodeURIComponent(routePath).replace(/\\/g, '/').replace(/^\/+/, '');

    let target: string | null = null;
    for (const root of ASSET_ROOT_CANDIDATES) {
      const normalized = path.normalize(path.join(root, rel));
      if (!normalized.startsWith(root)) continue;
      if (await pathExists(normalized)) {
        target = normalized;
        break;
      }
      const ci = await findFileCaseInsensitive(root, rel);
      if (ci) {
        target = ci;
        break;
      }
    }

    if (!target) {
      return res.status(404).json({ error: `Asset not found: ${rel}` });
    }

    const file = await readFile(target);
    res.setHeader('Content-Type', getMimeType(target));
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.statusCode = 200;
    res.end(file);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown API error';
    return res.status(500).json({ error: message });
  }
}
