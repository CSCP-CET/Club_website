import type { Request, Response, NextFunction } from 'express';
import { loadMembers } from '../data/loaders';

export async function getMembers(_req: Request, res: Response, next: NextFunction) {
  try {
    const members = await loadMembers();
    res.status(200).json(members);
  } catch (err) {
    next(err);
  }
}
