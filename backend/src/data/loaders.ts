import { eventsSchema, membersSchema, timelineSchema } from '../validators/schemas.js';
import membersJson from './members.json';
import eventsJson from './events.json';
import timelineJson from './timeline.json';

export async function loadMembers() {
  return membersSchema.parse(membersJson);
}

export async function loadEvents() {
  return eventsSchema.parse(eventsJson);
}

export async function loadTimeline() {
  return timelineSchema.parse(timelineJson);
}
