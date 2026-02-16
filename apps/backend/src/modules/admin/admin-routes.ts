import { Router } from 'express';

import { AdminController } from '@/modules/admin/admin-controller.js';

const router = Router();
const controller = new AdminController();

/**
 * @openapi
 * /admin/cleanup:
 *   post:
 *     summary: Run cleanup tasks
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cleanup tasks triggered successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/cleanup', controller.runCleanup);

export default router;
