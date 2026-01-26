// backend/src/modules/school/school.controller.ts
import { Request, Response } from 'express';
import { SchoolService } from './school.service';

const schoolService = new SchoolService();

export class SchoolController {
  async getSettings(req: Request, res: Response): Promise<void> {
    try {
      const settings = await schoolService.getSettings();

      res.json({
        success: true,
        data: settings,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async updateSettings(req: Request, res: Response): Promise<void> {
    try {
      // السماح فقط بتحديث اسم المدرسة والإدارة التعليمية
      const { schoolName, educationOffice } = req.body;

      const settings = await schoolService.updateSettings({
        schoolName,
        educationOffice,
      });

      res.json({
        success: true,
        message: 'تم تحديث معلومات المدرسة بنجاح',
        data: settings,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
}