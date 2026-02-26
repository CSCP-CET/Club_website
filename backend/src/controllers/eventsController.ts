import type { RequestHandler } from 'express';
import { loadEvents } from '../data/loaders';

export const getEvents: RequestHandler = async (_req, res, next) => {
  try {
    const events = await loadEvents();
    res.status(200).json(events);
  } catch (err) {
    next(err);
  }
};
