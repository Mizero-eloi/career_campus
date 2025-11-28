import { Router } from 'express';
import { body } from 'express-validator';
import {
  getResources,
  createResource,
  trackResourceAccess,
} from '../controllers/resourceController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getResources);

router.post(
  '/',
  authenticate,
  authorize('counselor', 'admin'),
  [
    body('title').trim().notEmpty(),
    body('resourceType').isIn(['article', 'video', 'document', 'course', 'tool']),
  ],
  createResource
);

router.post('/:resourceId/access', authenticate, trackResourceAccess);

export default router;

