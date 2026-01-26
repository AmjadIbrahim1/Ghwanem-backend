import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

import authRoutes from './modules/auth/auth.routes.js';
import gradesRoutes from './modules/grades/grades.routes.js';
import excelRoutes from './modules/excel/excel.routes.js';
import academicRoutes from './modules/academic/academic.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';
import schoolRoutes from './modules/school/school.routes.js';

const app = express();

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.FRONTEND_URL, // production FRONTEND URL
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
if (env.NODE_ENV === 'development') app.use(morgan('dev'));

// Health Check
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/grades', gradesRoutes);
app.use('/api/excel', excelRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/school', schoolRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
