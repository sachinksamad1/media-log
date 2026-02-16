import { protect } from '@common/middlewares/auth-middleware.js';
import { Router } from 'express';

import { UserActivityController } from './user-activity.controller.js';

export const userActivityRouter = Router();
const controller = new UserActivityController();

/**
 * @openapi
 * /user-activity:
 *   get:
 *     summary: Get recent user activity
 *     tags: [User Activity]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent user activity
 *       401:
 *         description: Unauthorized
 */
userActivityRouter.get('/', protect, controller.getRecent);
