import { Router } from 'express';
import { getMembers } from '../controllers/membersController';
import { getEvents } from '../controllers/eventsController';
import { getTimeline } from '../controllers/timelineController';

const router = Router();

router.get('/members', getMembers);
router.get('/events', getEvents);
router.get('/timeline', getTimeline);

export default router;
