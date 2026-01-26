// backend/src/modules/academic/academic.controller.ts
import { Request, Response } from 'express';
import { AcademicService } from './academic.service';
import { validate, academicSettingsSchema } from '../../utils/validation.util';

const academicService = new AcademicService();

export class AcademicController {
  async getSettings(req: Request, res: Response): Promise<void> {
    try {
      const { grade } = req.query;

      if (grade) {
        // إرجاع إعدادات صف محدد
        const settings = await academicService.getSettingsByGrade(grade as string);
        res.json({
          success: true,
          data: settings,
        });
      } else {
        // إرجاع جميع الإعدادات
        const settings = await academicService.getAllSettings();
        res.json({
          success: true,
          data: settings,
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async updateSettings(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = await validate(academicSettingsSchema, req.body);

      const settings = await academicService.updateSettings({
        academicYear: validatedData.academicYear,
        semester: validatedData.semester,
        grade: validatedData.grade,
      });

      res.json({
        success: true,
        message: 'تم تحديث الإعدادات بنجاح',
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