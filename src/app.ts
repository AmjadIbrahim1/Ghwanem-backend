// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// Routes
import authRoutes from './modules/auth/auth.routes';
import gradesRoutes from './modules/grades/grades.routes';
import excelRoutes from './modules/excel/excel.routes';
import academicRoutes from './modules/academic/academic.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import schoolRoutes from './modules/school/school.routes';

const app = express();

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// Body Parser
app.use(express.json());
app.use(express.urlencoding({ extended: true }));

// Logger
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Root Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'مرحباً بك في نظام نتائج مدرسة الغوانم الإعدادية',
    version: '1.0.0',
    endpoints: {
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
    timestamp: new Date().toISOString(),
  });
});

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    database: 'Connected',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/grades', gradesRoutes);
app.use('/api/excel', excelRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/school', schoolRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;