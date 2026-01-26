// backend/src/modules/excel/excel.parser.ts
import ExcelJS from 'exceljs';
import { ExcelRow, StudentData, GradeData } from '../../types';

export class ExcelParser {
  async parseExcelFile(filePath: string): Promise<StudentData[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new Error('الملف فارغ أو لا يحتوي على أوراق عمل');
    }

    const rows: any[] = [];
    const headers: string[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        // Header row
        row.eachCell((cell) => {
          headers.push(cell.value?.toString().trim() || '');
        });
      } else {
        // Data rows
        const rowData: any = {};
        row.eachCell((cell, colNumber) => {
          const header = headers[colNumber - 1];
          if (header) {
            rowData[header] = cell.value;
          }
        });
        rows.push(rowData);
      }
    });

    return this.processRows(rows, headers);
  }

  private processRows(rows: any[], headers: string[]): StudentData[] {
    const students: StudentData[] = [];

    // العثور على أعمدة رقم الجلوس والاسم
    const seatNumberColumn = headers.find(h => 
      h.includes('رقم الجلوس') || 
      h.includes('الجلوس') || 
      h.includes('رقم جلوس') ||
      h.toLowerCase().includes('seat')
    );
    
    const nameColumn = headers.find(h => 
      h.includes('الاسم') || 
      h.includes('اسم') || 
      h.includes('الطالب') ||
      h.toLowerCase().includes('name')
    );

    if (!seatNumberColumn || !nameColumn) {
      throw new Error('الملف يجب أن يحتوي على عمودي "رقم الجلوس" و "الاسم"');
    }

    // أعمدة المواد (كل الأعمدة ماعدا رقم الجلوس والاسم)
    const subjectColumns = headers.filter(
      h => h !== seatNumberColumn && h !== nameColumn && h.trim() !== ''
    );

    if (subjectColumns.length === 0) {
      throw new Error('الملف يجب أن يحتوي على مواد دراسية على الأقل');
    }

    for (const row of rows) {
      // تنظيف رقم الجلوس بشكل كامل
      const rawSeatNumber = row[seatNumberColumn];
      const seatNumber = this.cleanSeatNumber(rawSeatNumber);
      
      const name = row[nameColumn]?.toString().trim();

      if (!seatNumber || !name) {
        continue; // تجاهل الصفوف الفارغة
      }

      const grades: GradeData[] = [];
      let totalScore = 0;

      for (const subject of subjectColumns) {
        const scoreValue = row[subject];
        const score = this.parseScore(scoreValue);

        if (score !== null) {
          grades.push({
            subject: subject.trim(),
            score,
            maxScore: 100, // افتراضياً 100
          });
          totalScore += score;
        }
      }

      students.push({
        seatNumber,
        name,
        totalScore,
        rank: 0, // سيتم حسابه لاحقاً
        grades,
      });
    }

    return students;
  }

  // تنظيف رقم الجلوس من أي مسافات أو أحرف غير مرغوبة
  private cleanSeatNumber(value: any): string | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    // تحويل إلى نص وإزالة كل المسافات
    let cleaned = value.toString().trim();
    
    // إزالة المسافات من البداية والنهاية والوسط
    cleaned = cleaned.replace(/\s+/g, '');
    
    // إزالة أي أحرف خاصة غير مرغوبة (اختياري)
    // cleaned = cleaned.replace(/[^\w\u0600-\u06FF]/g, '');
    
    return cleaned || null;
  }

  private parseScore(value: any): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const num = typeof value === 'number' ? value : parseFloat(value.toString());

    if (isNaN(num)) {
      return null;
    }

    return num;
  }
}