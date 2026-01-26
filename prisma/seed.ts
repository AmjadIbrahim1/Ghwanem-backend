import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...\n');

  // ═══════════════════════════════════════════════════════════
  // 1. Create Admin Account
  // ═══════════════════════════════════════════════════════════
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@school.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
  const adminName = process.env.ADMIN_NAME || 'مدير النظام';

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      name: adminName,
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
    },
  });

  console.log('✅ Admin account created/updated:');
  console.log(`   Email: ${admin.email}`);
  console.log(`   Name: ${admin.name}`);
  console.log(`   Password: ${adminPassword}\n`);

  // ═══════════════════════════════════════════════════════════
  // 2. Create School Settings
  // ═══════════════════════════════════════════════════════════
  const schoolSettings = await prisma.schoolSettings.upsert({
    where: {
      id: '00000000-0000-0000-0000-000000000002',
    },
    update: {
      schoolName: 'مدرسة الغوانم الاعدادية المشتركة بالحوطا الغربية',
      educationOffice: 'إدارة ديروط التعليمية',
      developerName: 'Eng : Amjad Ibrahim',
      developerPhone: '+201030615045',
      developerEmail: 'amjadibrahim218@gmail.com',
    },
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      schoolName: 'مدرسة الغوانم الاعدادية المشتركة بالحوطا الغربية',
      educationOffice: 'إدارة ديروط التعليمية',
      developerName: 'Eng : Amjad Ibrahim',
      developerPhone: '+201030615045',
      developerEmail: 'amjadibrahim218@gmail.com',
    },
  });

  console.log('✅ School settings created/updated:');
  console.log(`   School: ${schoolSettings.schoolName}`);
  console.log(`   Office: ${schoolSettings.educationOffice}`);
  console.log(`   Developer: ${schoolSettings.developerName}\n`);

  // ═══════════════════════════════════════════════════════════
  // 3. Create Default Academic Settings
  // ═══════════════════════════════════════════════════════════
  const defaultYear = process.env.DEFAULT_ACADEMIC_YEAR || '2024-2025';
  const defaultSemester = process.env.DEFAULT_SEMESTER || 'الفصل الدراسي الأول';
  const defaultGrade = process.env.DEFAULT_GRADE || 'الصف الثالث الإعدادي';

  const academicSettings = await prisma.academicSettings.upsert({
    where: {
      id: '00000000-0000-0000-0000-000000000001',
    },
    update: {
      academicYear: defaultYear,
      semester: defaultSemester,
      grade: defaultGrade,
      isActive: true,
    },
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      academicYear: defaultYear,
      semester: defaultSemester,
      grade: defaultGrade,
      isActive: true,
    },
  });

  console.log('✅ Academic settings created/updated:');
  console.log(`   Year: ${academicSettings.academicYear}`);
  console.log(`   Semester: ${academicSettings.semester}`);
  console.log(`   Grade: ${academicSettings.grade}\n`);

  // ═══════════════════════════════════════════════════════════
  // 4. Create Sample Students (Optional - for testing)
  // ═══════════════════════════════════════════════════════════
  console.log('📚 Creating sample students for testing...\n');

  interface SampleStudent {
    seatNumber: string;
    name: string;
  }

  interface Subject {
    name: string;
    maxScore: number;
  }

  const sampleStudents: SampleStudent[] = [
    { seatNumber: '1001', name: 'أحمد محمد علي' },
    { seatNumber: '1002', name: 'فاطمة حسن محمود' },
    { seatNumber: '1003', name: 'محمد عبدالله إبراهيم' },
    { seatNumber: '1004', name: 'مريم سعيد أحمد' },
    { seatNumber: '1005', name: 'عمر خالد عبدالرحمن' },
  ];

  const subjects: Subject[] = [
    { name: 'اللغة العربية', maxScore: 100 },
    { name: 'اللغة الإنجليزية', maxScore: 100 },
    { name: 'الرياضيات', maxScore: 100 },
    { name: 'العلوم', maxScore: 100 },
    { name: 'الدراسات الاجتماعية', maxScore: 100 },
  ];

  for (const studentData of sampleStudents) {
    // حساب المجموع الكلي
    let totalScore = 0;
    const grades = subjects.map(subject => {
      const score = Math.floor(Math.random() * 31) + 70; // Random score between 70-100
      totalScore += score;
      return {
        subject: subject.name,
        score,
        maxScore: subject.maxScore,
      };
    });

    const student = await prisma.student.create({
      data: {
        seatNumber: studentData.seatNumber,
        name: studentData.name,
        totalScore,
        rank: 0, // سيتم تحديثه لاحقاً
        academicSettingsId: academicSettings.id,
        grades: {
          create: grades.map(grade => ({
            ...grade,
            academicSettingsId: academicSettings.id,
          })),
        },
      },
    });

    console.log(`   ✓ Created student: ${student.name} (${student.seatNumber}) - Total: ${totalScore}`);
  }

  // تحديث الترتيب
  const allStudents = await prisma.student.findMany({
    where: { academicSettingsId: academicSettings.id },
    orderBy: { totalScore: 'desc' },
  });

  let currentRank = 1;
  let previousScore = -1;

  for (let i = 0; i < allStudents.length; i++) {
    const student = allStudents[i];
    
    if (student.totalScore !== previousScore) {
      currentRank = i + 1;
      previousScore = student.totalScore;
    }

    await prisma.student.update({
      where: { id: student.id },
      data: { rank: currentRank },
    });
  }

  console.log('\n✅ Sample students and grades created successfully!\n');

  // ═══════════════════════════════════════════════════════════
  // Summary
  // ═══════════════════════════════════════════════════════════
  const totalStudents = await prisma.student.count();
  const totalGrades = await prisma.grade.count();

  console.log('═══════════════════════════════════════════════════════');
  console.log('📊 Database Seeding Summary:');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`✓ Admins: 1`);
  console.log(`✓ School Settings: 1`);
  console.log(`✓ Academic Settings: 1`);
  console.log(`✓ Students: ${totalStudents}`);
  console.log(`✓ Grades: ${totalGrades}`);
  console.log('═══════════════════════════════════════════════════════\n');
  
  console.log('🎉 Seeding completed successfully!\n');
  console.log('👉 You can now login with:');
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  })  ;