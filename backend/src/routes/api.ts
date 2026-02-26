import { Router } from 'express';
import { getMembers } from '../controllers/membersController.js';
import { getEvents } from '../controllers/eventsController.js';
import { getTimeline } from '../controllers/timelineController.js';

const router = Router();

router.get('/members', getMembers);
router.get('/events', getEvents);
router.get('/timeline', getTimeline);

export default router;
