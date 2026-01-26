// backend/src/middleware/auth.middleware.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { verifyToken } from '../utils/jwt.util';

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'غير مصرح بالدخول - يرجى تسجيل الدخول',
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer '

    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'الجلسة منتهية - يرجى تسجيل الدخول مرة أخرى',
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'خطأ في التحقق من الهوية',
    });
  }
};