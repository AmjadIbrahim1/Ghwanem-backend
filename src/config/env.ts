// backend/src/config/env.ts
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const env = {
  // Database
  DATABASE_URL: process.env['DATABASE_URL'] || '',

  // JWT
  JWT_SECRET: process.env['JWT_SECRET'] || 'default-secret-key',
  JWT_EXPIRES_IN: process.env['JWT_EXPIRES_IN'] || '7d',

  // Admin
  ADMIN_EMAIL: process.env['ADMIN_EMAIL'] || 'admin@school.com',
  ADMIN_PASSWORD: process.env['ADMIN_PASSWORD'] || 'Admin@123456',
  ADMIN_NAME: process.env['ADMIN_NAME'] || 'مدير النظام',

  // Server
  PORT: parseInt(process.env['PORT'] || '5000', 10),
  NODE_ENV: process.env['NODE_ENV'] || 'development',

  // CORS
  FRONTEND_URL: process.env['FRONTEND_URL'] || 'http://localhost:5173',

  // Upload
  MAX_FILE_SIZE: parseInt(process.env['MAX_FILE_SIZE'] || '10485760', 10), // 10MB
  UPLOAD_PATH: path.resolve(process.cwd(), process.env['UPLOAD_PATH'] || './uploads'),

  // Academic
  DEFAULT_ACADEMIC_YEAR: process.env['DEFAULT_ACADEMIC_YEAR'] || '2024-2025',
  DEFAULT_SEMESTER: process.env['DEFAULT_SEMESTER'] || 'الفصل الدراسي الأول',
};

// Validate critical env variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}