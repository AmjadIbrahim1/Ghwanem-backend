// backend/src/modules/academic/academic.routes.ts
import { Router } from 'express';
import { AcademicController } from './academic.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const academicController = new AcademicController();

// Public route to get settings
router.get('/settings', (req, res) => academicController.getSettings(req, res));

// Protected route to update settings
router.put('/settings', authMiddleware, (req, res) =>
  academicController.updateSettings(req, res)
);

export default router;