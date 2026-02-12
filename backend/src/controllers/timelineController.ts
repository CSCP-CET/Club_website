import type { Request, Response, NextFunction } from 'express';
import { loadTimeline } from '../data/loaders';

export async function getTimeline(_req: Request, res: Response, next: NextFunction) {
  try {
    const timeline = await loadTimeline();
    res.status(200).json(timeline);
  } catch (err) {
    next(err);
  }
}
