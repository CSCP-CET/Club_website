import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { eventsSchema, membersSchema, timelineSchema } from '../validators/schemas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function readJsonFile(fileName: string): Promise<unknown> {
  const p = path.join(__dirname, fileName);
  const raw = await readFile(p, 'utf-8');
  return JSON.parse(raw) as unknown;
}

export async function loadMembers() {
  const data = await readJsonFile('members.json');
  return membersSchema.parse(data);
}

export async function loadEvents() {
  const data = await readJsonFile('events.json');
  return eventsSchema.parse(data);
}

export async function loadTimeline() {
  const data = await readJsonFile('timeline.json');
  return timelineSchema.parse(data);
}
