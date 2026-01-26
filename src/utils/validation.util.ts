// backend/src/utils/validation.util.ts
import * as yup from 'yup';

// Login Schema
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('البريد الإلكتروني غير صحيح')
    .required('البريد الإلكتروني مطلوب'),
  password: yup
    .string()
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    .required('كلمة المرور مطلوبة'),
});

// Seat Number Schema
export const seatNumberSchema = yup.object().shape({
  seatNumber: yup.string().required('رقم الجلوس مطلوب'),
});

// Academic Settings Schema
export const academicSettingsSchema = yup.object().shape({
  academicYear: yup
    .string()
    .required('السنة الدراسية مطلوبة')
    .matches(/^\d{4}-\d{4}$/, 'صيغة السنة الدراسية غير صحيحة (مثال: 2024-2025)'),
  semester: yup
    .string()
    .required('الفصل الدراسي مطلوب')
    .oneOf(
      ['الفصل الدراسي الأول', 'الفصل الدراسي الثاني'],
      'الفصل الدراسي غير صحيح'
    ),
  grade: yup
    .string()
    .optional()
    .default('الصف الثالث الإعدادي'),
});

// School Settings Schema
export const schoolSettingsSchema = yup.object().shape({
  schoolName: yup.string().optional(),
  educationOffice: yup.string().optional(),
  developerName: yup.string().optional(),
  developerPhone: yup.string().optional(),
  developerEmail: yup.string().email('البريد الإلكتروني غير صحيح').optional(),
});

// Generic validation function
export const validate = async <T>(schema: yup.Schema<T>, data: any): Promise<T> => {
  try {
    return await schema.validate(data, { abortEarly: false });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors = error.inner.map((err) => err.message).join(', ');
      throw new Error(errors);
    }
    throw error;
  }
};