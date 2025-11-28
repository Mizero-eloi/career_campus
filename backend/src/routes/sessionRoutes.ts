import { Router } from 'express';
import { body } from 'express-validator';
import {
  createSession,
  getSessions,
  updateSession,
} from '../controllers/sessionController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  [
    body('counselorId').isInt(),
    body('scheduledAt').isISO8601(),
    body('durationMinutes').optional().isInt({ min: 15, max: 120 }),
  ],
  createSession
);

router.get('/', getSessions);

router.patch('/:sessionId', updateSession);

export default router;

