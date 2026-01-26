// backend/src/modules/grades/grades.routes.ts
import { Router } from 'express';
import { GradesController } from './grades.controller.js';

const router = Router();
const gradesController = new GradesController();

// Get student by seat number
router.get('/student/:seatNumber', (req, res) =>
  gradesController.getStudentResult(req, res)
);

// Get all students
router.get('/all', (req, res) => gradesController.getAllStudents(req, res));

// Get students by academic year
router.get('/by-year', (req, res) => gradesController.getStudentsByYear(req, res));

export default router;