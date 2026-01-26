// backend/src/modules/analytics/analytics.controller.ts
import { Request, Response } from 'express';
import { AnalyticsService } from './analytics.service';

const analyticsService = new AnalyticsService();

export class AnalyticsController {
  async getAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { grade } = req.query;
      
      const analytics = await analyticsService.getAnalytics(grade as string | undefined);

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}