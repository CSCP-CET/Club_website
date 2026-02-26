import type { RequestHandler } from 'express';
import { loadMembers } from '../data/loaders';

export const getMembers: RequestHandler = async (_req, res, next) => {
  try {
    const members = await loadMembers();
    res.status(200).json(members);
  } catch (err) {
    next(err);
  }
};
