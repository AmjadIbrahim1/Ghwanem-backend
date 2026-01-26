// backend/src/modules/academic/academic.service.ts
import prisma from '../../config/db.js';

export class AcademicService {
  async getSettings() {
    // إرجاع جميع الإعدادات النشطة لكل الصفوف
    const settings = await prisma.academicSettings.findMany({
      where: { isActive: true },
      orderBy: { grade: 'asc' }
    });

    if (settings.length === 0) {
      // إنشاء إعدادات افتراضية لكل صف
      const defaultSettings = await this.createDefaultSettings();
      return defaultSettings;
    }

    // إرجاع أول إعداد كإعداد رئيسي (للتوافق مع الكود القديم)
    return settings[0];
  }

  async getAllSettings() {
    // إرجاع جميع الإعدادات النشطة
    const settings = await prisma.academicSettings.findMany({
      where: { isActive: true },
      orderBy: { grade: 'asc' }
    });

    if (settings.length === 0) {
      return await this.createDefaultSettings();
    }

    return settings;
  }

  async getSettingsByGrade(grade: string) {
    let settings = await prisma.academicSettings.findFirst({
      where: { 
        isActive: true,
        grade: grade 
      },
    });

    if (!settings) {
      // إنشاء إعدادات جديدة لهذا الصف
      const currentYear = new Date().getFullYear();
      const academicYear = `${currentYear}-${currentYear + 1}`;
      
      settings = await prisma.academicSettings.create({
        data: {
          academicYear: academicYear,
          semester: 'الفصل الدراسي الأول',
          grade: grade,
          isActive: true,
        },
      });
    }

    return settings;
  }

  async updateSettings(data: {
    academicYear: string;
    semester: string;
    grade?: string;
  }) {
    const grade = data.grade || 'الصف الأول الإعدادي';
    
    // البحث عن الإعدادات الحالية لهذا الصف
    let settings = await prisma.academicSettings.findFirst({
      where: { 
        isActive: true,
        grade: grade 
      },
    });

    if (!settings) {
      // إنشاء إعدادات جديدة لهذا الصف
      settings = await prisma.academicSettings.create({
        data: {
          academicYear: data.academicYear,
          semester: data.semester,
          grade: grade,
          isActive: true,
        },
      });
    } else {
      // تحديث الإعدادات الموجودة
      settings = await prisma.academicSettings.update({
        where: { id: settings.id },
        data: {
          academicYear: data.academicYear,
          semester: data.semester,
        },
      });
    }

    return settings;
  }

  private async createDefaultSettings() {
    const currentYear = new Date().getFullYear();
    const academicYear = `${currentYear}-${currentYear + 1}`;
    
    const grades = ['الصف الأول الإعدادي', 'الصف الثانى الإعدادي'];
    const settings = [];

    for (const grade of grades) {
      const setting = await prisma.academicSettings.create({
        data: {
          academicYear: academicYear,
          semester: 'الفصل الدراسي الأول',
          grade: grade,
          isActive: true,
        },
      });
      settings.push(setting);
    }

    return settings[0]; // إرجاع أول إعداد للتوافق
  }
}