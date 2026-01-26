import { protect } from '@common/middlewares/auth-middleware.js';
import { Router } from 'express';

import { UserActivityController } from './user-activity.controller.js';

export const userActivityRouter = Router();
const controller = new UserActivityController();

userActivityRouter.get('/', protect, controller.getRecent);
