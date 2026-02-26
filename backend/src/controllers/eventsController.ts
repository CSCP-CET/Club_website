import { loadEvents } from '../data/loaders';

export async function getEvents(_req: any, res: any, next: any) {
  try {
    const events = await loadEvents();
    res.status(200).json(events);
  } catch (err) {
    next(err);
  }
}
