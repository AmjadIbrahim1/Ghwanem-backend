// backend/src/modules/excel/excel.service.ts
import prisma from '../../config/db.js';
import { ExcelParser } from './excel.parser.js';
import { calculateRanks } from '../../utils/ranking.util.js';
import fs from 'fs';

export class ExcelService {
  private parser: ExcelParser;

  constructor() {
    this.parser = new ExcelParser();
  }

  async uploadAndProcess(filePath: string, grade: string, uploadedBy: string = 'admin@school.com') {
    try {
      // Parse Excel file
      const studentsData = await this.parser.parseExcelFile(filePath);

      if (studentsData.length === 0) {
        throw new Error('الملف لا يحتوي على بيانات طلاب');
      }

      // Get or create academic settings for this specific grade
      let settings = await prisma.academicSettings.findFirst({
        where: { 
          isActive: true,
          grade: grade
        },
      });

      // If no settings exist for this grade, create them
      if (!settings) {
        // Get the current year to create default academic year
        const currentYear = new Date().getFullYear();
        const academicYear = `${currentYear}-${currentYear + 1}`;

        // Create new settings for this grade
        settings = await prisma.academicSettings.create({
          data: {
            academicYear: academicYear,
            semester: 'الفصل الدراسي الأول',
            grade: grade,
            isActive: true,
          },
        });
      }

      // Calculate ranks
      const rankedStudents = calculateRanks(studentsData);

      // Delete old data for this specific grade only
      await prisma.$transaction(async (tx) => {
        // Delete grades first
        await tx.grade.deleteMany({
          where: { academicSettingsId: settings!.id },
        });

        // Then delete students
        await tx.student.deleteMany({
          where: { academicSettingsId: settings!.id },
        });
      });

      // Insert new data
      const createdStudents = await prisma.$transaction(
        rankedStudents.map(student =>
          prisma.student.create({
            data: {
              seatNumber: student.seatNumber,
              name: student.name,
              totalScore: student.totalScore,
              rank: student.rank,
              academicSettingsId: settings!.id,
              grades: {
                create: student.grades.map(grade => ({
                  subject: grade.subject,
                  score: grade.score,
                  maxScore: grade.maxScore,
                  academicSettingsId: settings!.id,
                })),
              },
            },
            include: {
              grades: true,
            },
          })
        )
      );

      // Calculate total grades
      const totalGrades = createdStudents.reduce(
        (sum, student) => sum + student.grades.length,
        0
      );

      // Save upload record
      const filename = filePath.split('/').pop() || 'unknown.xlsx';
      const fileStats = fs.statSync(filePath);

      await prisma.excelUpload.create({
        data: {
          filename,
          originalName: filename,
          fileSize: fileStats.size,
          uploadedBy,
          studentsCount: createdStudents.length,
          gradesCount: totalGrades,
          academicYear: settings.academicYear,
          semester: settings.semester,
        },
      });

      // Delete temporary file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return {
        totalStudents: createdStudents.length,
        totalGrades,
        academicYear: settings.academicYear,
        semester: settings.semester,
        grade: settings.grade,
      };
    } catch (error) {
      // Delete file in case of error
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw error;
    }
  }

  async getUploadHistory(limit: number = 10) {
    return await prisma.excelUpload.findMany({
      orderBy: {
        uploadedAt: 'desc',
      },
      take: limit,
    });
  }
}