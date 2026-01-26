-- AlterTable
ALTER TABLE "academic_settings" ADD COLUMN     "grade" TEXT NOT NULL DEFAULT 'الصف الثالث الإعدادي';

-- CreateTable
CREATE TABLE "school_settings" (
    "id" TEXT NOT NULL,
    "schoolName" TEXT NOT NULL DEFAULT 'مدرسة الغوانم الاعدادية المشتركة بالحوطا الغربية',
    "educationOffice" TEXT NOT NULL DEFAULT 'إدارة ديروط التعليمية',
    "developerName" TEXT NOT NULL DEFAULT 'Eng : Amjad Ibrahim',
    "developerPhone" TEXT NOT NULL DEFAULT '+201030615045',
    "developerEmail" TEXT NOT NULL DEFAULT 'amjadibrahim218@gmail.com',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_settings_pkey" PRIMARY KEY ("id")
);
