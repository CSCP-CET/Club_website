import { loadMembers } from '../data/loaders.js';

export async function getMembers(_req: any, res: any, next: any) {
  try {
    const members = await loadMembers();
    res.status(200).json(members);
  } catch (err) {
    next(err);
  }
}
