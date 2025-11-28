import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAllUsers,
  verifyCounselor,
  updateUserStatus,
  getPlatformStats,
} from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.get('/stats', getPlatformStats);
router.patch('/counselors/:counselorId/verify', verifyCounselor);
router.patch(
  '/users/:userId/status',
  [body('isActive').isBoolean()],
  updateUserStatus
);

export default router;

