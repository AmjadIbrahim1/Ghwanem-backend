// backend/src/modules/excel/excel.controller.ts
import { Response } from 'express';
import { AuthRequest } from '../../types';
import { ExcelService } from './excel.service';

const excelService = new ExcelService();

export class ExcelController {
  async upload(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: 'لم يتم رفع أي ملف',
        });
        return;
      }

      // Get grade from request body
      const { grade } = req.body;

      if (!grade) {
        res.status(400).json({
          success: false,
          error: 'يجب تحديد الصف الدراسي',
        });
        return;
      }

      // Validate grade
      const validGrades = ['الصف الأول الإعدادي', 'الصف الثانى الإعدادي'];
      if (!validGrades.includes(grade)) {
        res.status(400).json({
          success: false,
          error: 'الصف الدراسي غير صحيح',
        });
        return;
      }

      const uploadedBy = req.user?.email || 'admin@school.com';
      const result = await excelService.uploadAndProcess(req.file.path, grade, uploadedBy);

      res.json({
        success: true,
        message: `تم رفع ومعالجة بيانات ${result.totalStudents} طالب بنجاح لـ ${grade}`,
        data: result,
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'فشل في رفع الملف',
      });
    }
  }

  async getHistory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const history = await excelService.getUploadHistory(limit);

      res.json({
        success: true,
        data: history,
      });
    } catch (error: any) {
      console.error('Get history error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'فشل في جلب سجل الرفع',
      });
    }
  }
}