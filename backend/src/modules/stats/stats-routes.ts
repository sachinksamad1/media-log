import { repositories } from '@common/media/media-repositories.js';
import { protect } from '@common/middlewares/auth-middleware.js';
import { Router } from 'express';

import { StatsController } from './stats-controller.js';
import { StatsService } from './stats-service.js';

const router = Router();

const statsService = new StatsService(repositories);
const statsController = new StatsController(statsService);

router.use(protect);

router.get('/summary', statsController.getSummary);

export default router;
