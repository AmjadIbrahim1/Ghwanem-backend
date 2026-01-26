// backend/src/modules/school/school.routes.ts
import { Router } from 'express';
import { SchoolController } from './school.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const schoolController = new SchoolController();

router.get('/settings', (req, res) => schoolController.getSettings(req, res));
router.put('/settings', authMiddleware, (req, res) =>
  schoolController.updateSettings(req, res)
);

export default router;