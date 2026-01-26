// backend/src/modules/auth/auth.routes.ts
import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

router.post('/login', (req, res) => authController.login(req, res));
router.get('/verify', authMiddleware, (req, res) => authController.verify(req, res));
router.post('/logout', authMiddleware, (req, res) => authController.logout(req, res));

export default router;