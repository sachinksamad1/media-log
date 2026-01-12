import { Router } from 'express';

import { AdminController } from './admin-controller.js';

const router = Router();
const controller = new AdminController();

/**
 * POST /api/v1/admin/cleanup
 * Use POST for actions that modify or delete server resources
 */
router.post('/cleanup', controller.runCleanup);

export default router;
