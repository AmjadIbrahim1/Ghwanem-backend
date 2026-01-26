// backend/src/auth/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { validate, loginSchema } from '../../utils/validation.util';
import { AuthRequest } from '../../types';

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = await validate(loginSchema, req.body);

      const result = await authService.login(
        validatedData.email,
        validatedData.password
      );

      res.json({
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: error.message,
      });
    }
  }

  async verify(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'غير مصرح',
        });
        return;
      }

      res.json({
        success: true,
        data: {
          user: req.user,
        },
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: error.message,
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    res.json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح',
    });
  }
}