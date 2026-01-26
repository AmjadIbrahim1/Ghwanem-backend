// backend/src/modules/grades/grades.controller.ts
import { Request, Response } from 'express';
import { GradesService } from './grades.service.js';
import { validate, seatNumberSchema } from '../../utils/validation.util.js';

const gradesService = new GradesService();

export class GradesController {
  async getStudentResult(req: Request, res: Response): Promise<void> {
    try {
      const { seatNumber } = req.params;
      const { grade } = req.query;

      await validate(seatNumberSchema, { seatNumber });

      console.log('Searching for student:', {
        seatNumber,
        grade: grade || 'any'
      });

      const student = await gradesService.getStudentBySeatNumber(
        seatNumber, 
        grade as string | undefined
      );

      res.json({
        success: true,
        data: student,
      });
    } catch (error: any) {
      console.error('Error in getStudentResult:', error);
      const statusCode = error.message === 'رقم الجلوس غير موجود' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getAllStudents(req: Request, res: Response): Promise<void> {
    try {
      const { grade } = req.query;
      const students = await gradesService.getAllStudents(grade as string | undefined);

      res.json({
        success: true,
        data: students,
      });
    } catch (error: any) {
      console.error('Error in getAllStudents:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getStudentsByYear(req: Request, res: Response): Promise<void> {
    try {
      const { academicYear, semester, grade } = req.query;

      if (!academicYear || !semester) {
        res.status(400).json({
          success: false,
          error: 'السنة والفصل الدراسي مطلوبان',
        });
        return;
      }

      const students = await gradesService.getStudentsByYear(
        academicYear as string,
        semester as string,
        grade as string | undefined
      );

      res.json({
        success: true,
        data: students,
      });
    } catch (error: any) {
      console.error('Error in getStudentsByYear:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}