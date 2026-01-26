// backend/src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('❌ Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'حدث خطأ في الخادم';

  res.status(statusCode).json({
    success: false,
    error: message,
    path: req.path,
    method: req.method,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    error: 'المسار غير موجود',
    path: req.path,
    method: req.method,
    availableEndpoints: {
      root: '/',
      health: '/health',
      api: {
        auth: '/api/auth',
        grades: '/api/grades',
        excel: '/api/excel',
        academic: '/api/academic',
        analytics: '/api/analytics',
        school: '/api/school',
      },
    },
  });
};