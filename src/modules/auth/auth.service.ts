// backend/src/modules/auth/auth.service.ts
import prisma from '../../config/db';
import { comparePassword } from '../../utils/hash.util';
import { generateToken, verifyToken } from '../../utils/jwt.util';

export class AuthService {
  async login(email: string, password: string) {
    // البحث عن الأدمن
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    // التحقق من كلمة المرور
    const isPasswordValid = await comparePassword(password, admin.password);

    if (!isPasswordValid) {
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    // إنشاء التوكن
    const token = generateToken({
      id: admin.id,
      email: admin.email,
    });

    return {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    };
  }

  async verifyToken(token: string) {
    try {
      const decoded = verifyToken(token);
      
      const admin = await prisma.admin.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      if (!admin) {
        throw new Error('المستخدم غير موجود');
      }

      return admin;
    } catch (error) {
      throw new Error('جلسة غير صالحة');
    }
  }
}