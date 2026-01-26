// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// Routes
import authRoutes from './modules/auth/auth.routes.js';
import gradesRoutes from './modules/grades/grades.routes.js';
import excelRoutes from './modules/excel/excel.routes.js';
import academicRoutes from './modules/academic/academic.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';
import schoolRoutes from './modules/school/school.routes.js';

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
app.use(express.urlencoded({ extended: true }));

// Logger
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
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