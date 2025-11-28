import { Router } from 'express';
import { body } from 'express-validator';
import {
  updateStudentProfile,
  submitAssessment,
  getCareerRecommendations,
  getGoals,
  createGoal,
  updateGoal,
} from '../controllers/studentController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.use(authorize('student'));

router.patch('/profile', updateStudentProfile);

router.post(
  '/assessment',
  [body('assessmentType').notEmpty(), body('responses').isObject()],
  submitAssessment
);

router.get('/recommendations', getCareerRecommendations);

router.get('/goals', getGoals);
router.post(
  '/goals',
  [body('goalTitle').trim().notEmpty()],
  createGoal
);
router.patch('/goals/:goalId', updateGoal);

export default router;

