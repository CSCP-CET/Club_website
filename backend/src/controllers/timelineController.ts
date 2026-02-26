import { loadTimeline } from '../data/loaders';

export async function getTimeline(_req: any, res: any, next: any) {
  try {
    const timeline = await loadTimeline();
    res.status(200).json(timeline);
  } catch (err) {
    next(err);
  }
}
