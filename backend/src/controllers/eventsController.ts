import type { Request, Response, NextFunction } from 'express';
import { loadEvents } from '../data/loaders';

export async function getEvents(_req: Request, res: Response, next: NextFunction) {
  try {
    const events = await loadEvents();
    res.status(200).json(events);
  } catch (err) {
    next(err);
  }
}
