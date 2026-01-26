// backend/src/modules/grades/grades.service.ts
import prisma from '../../config/db.js';

export class GradesService {
  async getStudentBySeatNumber(seatNumber: string, grade?: string) {
    // تنظيف رقم الجلوس من المسافات
    const cleanedSeatNumber = seatNumber.trim().replace(/\s+/g, '');
    
    console.log('=== Student Search Debug ===');
    console.log('Original seat number:', seatNumber);
    console.log('Cleaned seat number:', cleanedSeatNumber);
    console.log('Grade filter:', grade || 'none');
    
    // الحصول على الإعدادات الحالية
    const settings = await prisma.academicSettings.findFirst({
      where: { 
        isActive: true,
        ...(grade && { grade })
      },
    });

    console.log('Found settings:', settings ? {
      id: settings.id,
      grade: settings.grade,
      academicYear: settings.academicYear,
      semester: settings.semester
    } : 'null');

    if (!settings) {
      throw new Error('لم يتم تحديد السنة والفصل الدراسي');
    }

    // الحصول على معلومات المدرسة
    const schoolSettings = await prisma.schoolSettings.findFirst();

    // البحث عن الطالب
    const student = await prisma.student.findFirst({
      where: {
        seatNumber: cleanedSeatNumber,
        academicSettingsId: settings.id,
      },
      include: {
        grades: {
          orderBy: {
            subject: 'asc',
          },
        },
        academicSettings: {
          select: {
            academicYear: true,
            semester: true,
            grade: true,
          },
        },
      },
    });

    if (!student) {
      // البحث عن جميع الطلاب لمعرفة المشكلة
      const allStudents = await prisma.student.findMany({
        where: {
          academicSettingsId: settings.id,
        },
        select: {
          seatNumber: true,
          name: true,
        },
        take: 10,
      });
      
      console.log('=== Available Students (first 10) ===');
      allStudents.forEach(s => {
        console.log(`Seat: "${s.seatNumber}" | Name: ${s.name}`);
        console.log(`  Match: ${s.seatNumber === cleanedSeatNumber ? 'YES' : 'NO'}`);
        console.log(`  Length: ${s.seatNumber.length} vs ${cleanedSeatNumber.length}`);
      });
      console.log('===========================');
      
      throw new Error('رقم الجلوس غير موجود');
    }

    console.log('Student found:', student.name);
    console.log('===========================');

    // إضافة السنة والفصل والصف ومعلومات المدرسة للنتيجة
    return {
      ...student,
      academicYear: student.academicSettings.academicYear,
      semester: student.academicSettings.semester,
      grade: student.academicSettings.grade,
      schoolInfo: schoolSettings ? {
        schoolName: schoolSettings.schoolName,
        educationOffice: schoolSettings.educationOffice,
        developerName: schoolSettings.developerName,
        developerPhone: schoolSettings.developerPhone,
        developerEmail: schoolSettings.developerEmail,
      } : null,
    };
  }

  async getAllStudents(grade?: string) {
    const settings = await prisma.academicSettings.findFirst({
      where: { 
        isActive: true,
        ...(grade && { grade })
      },
    });

    if (!settings) {
      throw new Error('لم يتم تحديد السنة والفصل الدراسي');
    }

    const schoolSettings = await prisma.schoolSettings.findFirst();

    const students = await prisma.student.findMany({
      where: {
        academicSettingsId: settings.id,
      },
      include: {
        grades: true,
        academicSettings: {
          select: {
            academicYear: true,
            semester: true,
            grade: true,
          },
        },
      },
      orderBy: {
        rank: 'asc',
      },
    });

    return {
      students: students.map(student => ({
        ...student,
        academicYear: student.academicSettings.academicYear,
        semester: student.academicSettings.semester,
        grade: student.academicSettings.grade,
      })),
      schoolInfo: schoolSettings ? {
        schoolName: schoolSettings.schoolName,
        educationOffice: schoolSettings.educationOffice,
        developerName: schoolSettings.developerName,
        developerPhone: schoolSettings.developerPhone,
        developerEmail: schoolSettings.developerEmail,
      } : null,
    };
  }

  async getStudentsByYear(academicYear: string, semester: string, grade?: string) {
    // Find the academic settings
    const settings = await prisma.academicSettings.findFirst({
      where: {
        academicYear,
        semester,
        ...(grade && { grade })
      },
    });

    if (!settings) {
      throw new Error('السنة والفصل الدراسي غير موجودين');
    }

    const schoolSettings = await prisma.schoolSettings.findFirst();

    const students = await prisma.student.findMany({
      where: {
        academicSettingsId: settings.id,
      },
      include: {
        grades: true,
        academicSettings: {
          select: {
            academicYear: true,
            semester: true,
            grade: true,
          },
        },
      },
      orderBy: {
        rank: 'asc',
      },
    });

    return {
      students: students.map(student => ({
        ...student,
        academicYear: student.academicSettings.academicYear,
        semester: student.academicSettings.semester,
        grade: student.academicSettings.grade,
      })),
      schoolInfo: schoolSettings ? {
        schoolName: schoolSettings.schoolName,
        educationOffice: schoolSettings.educationOffice,
        developerName: schoolSettings.developerName,
        developerPhone: schoolSettings.developerPhone,
        developerEmail: schoolSettings.developerEmail,
      } : null,
    };
  }
}