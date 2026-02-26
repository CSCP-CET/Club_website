import { eventsSchema, membersSchema, timelineSchema } from '../validators/schemas.js';
import { readFile } from 'node:fs/promises';

async function readJsonFile(fileName: string): Promise<unknown> {
  const fileUrl = new URL(`./${fileName}`, import.meta.url);
  const raw = await readFile(fileUrl, 'utf-8');
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
