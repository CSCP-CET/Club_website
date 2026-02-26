import { readFile } from 'node:fs/promises';
import path from 'node:path';
const PROJECT_ROOT = process.cwd();
const DATA_ROOT = path.join(PROJECT_ROOT, 'backend', 'src', 'data');

const jsonFiles: Record<string, string> = {
  members: 'members.json',
  events: 'events.json',
  timeline: 'timeline.json',
};

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

    if (apiPath === 'health' || apiPath === '') {
      return res.status(200).json({ ok: true });
    }

    return res.status(404).json({ error: `Not Found: ${apiPath}` });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown API error';
    return res.status(500).json({ error: message });
  }
}
