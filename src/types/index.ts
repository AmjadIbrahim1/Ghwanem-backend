// backend/src/types/index.ts
import { Request } from 'express';

// Auth Types
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

// Student Types
export interface StudentData {
  seatNumber: string;
  name: string;
  totalScore: number;
  rank: number;
  grades: GradeData[];
}

export interface GradeData {
  subject: string;
  score: number;
  maxScore: number;
}

// Excel Row Type
export interface ExcelRow {
  [key: string]: any;
  'رقم الجلوس': string | number;
  'الاسم': string;
}

// Analytics Types
export interface AnalyticsData {
  totalStudents: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
  topStudents: TopStudent[];
  subjectStats: SubjectStats[];
  scoreDistribution: ScoreDistribution[];
}

export interface TopStudent {
  seatNumber: string;
  name: string;
  totalScore: number;
  rank: number;
}

export interface SubjectStats {
  subject: string;
  average: number;
  highest: number;
  lowest: number;
}

export interface ScoreDistribution {
  range: string;
  count: number;
  percentage: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}