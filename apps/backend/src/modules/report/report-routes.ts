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

/**
 * @openapi
 * /reports:
 *   get:
 *     summary: Get paginated report data
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paginated report data
 *       401:
 *         description: Unauthorized
 */
router.get('/', reportController.getReport);

/**
 * @openapi
 * /reports/summary:
 *   get:
 *     summary: Get quick report summary
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Report summary
 *       401:
 *         description: Unauthorized
 */
router.get('/summary', reportController.getSummary);

/**
 * @openapi
 * /reports/export:
 *   get:
 *     summary: Export report data
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Exported data
 *       401:
 *         description: Unauthorized
 */
router.get('/export', reportController.exportReport);

export default router;
