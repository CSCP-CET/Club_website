import type { RequestHandler } from 'express';
import { loadTimeline } from '../data/loaders';

export const getTimeline: RequestHandler = async (_req, res, next) => {
  try {
    const timeline = await loadTimeline();
    res.status(200).json(timeline);
  } catch (err) {
    next(err);
  }
};
