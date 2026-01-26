// backend/src/analytics/analytics.routes.ts
import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';

const router = Router();
const analyticsController = new AnalyticsController();

router.get('/', (req, res) => analyticsController.getAnalytics(req, res));

export default router;