import { repositories } from '@common/media/media-repositories.js';
import { protect } from '@common/middlewares/auth-middleware.js';
import { Router } from 'express';

import { ReportController } from './report-controller.js';
import { ReportService } from './report-service.js';

const router = Router();

const reportService = new ReportService(repositories);
const reportController = new ReportController(reportService);

// All report routes require authentication
router.use(protect);

// GET /api/reports - Get paginated report data
router.get('/', reportController.getReport);

// GET /api/reports/summary - Get quick summary
router.get('/summary', reportController.getSummary);

// GET /api/reports/export - Export report data
router.get('/export', reportController.exportReport);

export default router;
