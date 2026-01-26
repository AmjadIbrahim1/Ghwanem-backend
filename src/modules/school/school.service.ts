// backend/src/modules/school/school.service.ts
import prisma from '../../config/db.js';

export class SchoolService {
  async getSettings() {
    let settings = await prisma.schoolSettings.findFirst();

    if (!settings) {
      // إنشاء إعدادات افتراضية إذا لم تكن موجودة
      settings = await prisma.schoolSettings.create({
        data: {
          schoolName: 'مدرسة الغوانم الاعدادية المشتركة بالحوطا الغربية',
          educationOffice: 'إدارة ديروط التعليمية',
          developerName: 'Eng : Amjad Ibrahim',
          developerPhone: '+201030615045',
          developerEmail: 'amjadibrahim218@gmail.com',
        },
      });
    }

    return settings;
  }

  async updateSettings(data: {
    schoolName?: string;
    educationOffice?: string;
    // لا نسمح بتغيير معلومات المطور
  }) {
    let settings = await prisma.schoolSettings.findFirst();

    if (!settings) {
      // إنشاء جديد إذا لم يكن موجود
      return await prisma.schoolSettings.create({
        data: {
          schoolName: data.schoolName || 'مدرسة الغوانم الاعدادية المشتركة بالحوطا الغربية',
          educationOffice: data.educationOffice || 'إدارة ديروط التعليمية',
          // معلومات المطور ثابتة
          developerName: 'Eng : Amjad Ibrahim',
          developerPhone: '+201030615045',
          developerEmail: 'amjadibrahim218@gmail.com',
        },
      });
    }

    // تحديث الموجود (فقط اسم المدرسة والإدارة)
    return await prisma.schoolSettings.update({
      where: { id: settings.id },
      data: {
        ...(data.schoolName && { schoolName: data.schoolName }),
        ...(data.educationOffice && { educationOffice: data.educationOffice }),
        // معلومات المطور لا تتغير أبداً
        developerName: 'Eng : Amjad Ibrahim',
        developerPhone: '+201030615045',
        developerEmail: 'amjadibrahim218@gmail.com',
      },
    });
  }
}