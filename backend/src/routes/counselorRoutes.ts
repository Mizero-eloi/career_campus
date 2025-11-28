import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  getCounselors,
  getStudentProfiles,
  updateCounselorProfile,
} from '../controllers/counselorController';

const router = Router();

router.get('/', getCounselors);

router.get('/students', authenticate, authorize('counselor'), getStudentProfiles);
router.patch('/profile', authenticate, authorize('counselor'), updateCounselorProfile);

export default router;

