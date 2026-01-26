// backend/src/excel/excel.routes.ts
import { Router } from 'express';
import { ExcelController } from './excel.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { uploadExcel } from '../../middleware/upload.middleware';

const router = Router();
const excelController = new ExcelController();

router.post('/upload', authMiddleware, uploadExcel, (req, res) =>
  excelController.upload(req, res)
);

export default router;