import { repositories } from '@common/media/media-repositories.js';
import { protect } from '@common/middlewares/auth-middleware.js';
import { DashboardController } from '@modules/dashboard/dashboard-controller.js';
import { DashboardService } from '@modules/dashboard/dashboard-service.js';
import { Router } from 'express';

const router = Router();

const dashboardService = new DashboardService(repositories);
const dashboardController = new DashboardController(dashboardService);

router.use(protect);

/**
 * @openapi
 * /dashboard/library-summary:
 *   get:
 *     summary: Get library summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Library summary statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: number
 *                 byStatus:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *       401:
 *         description: Unauthorized
 */
router.get('/library-summary', dashboardController.getLibrarySummary);

export default router;
