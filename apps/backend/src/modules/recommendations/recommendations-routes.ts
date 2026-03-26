import { protect } from '@common/middlewares/auth-middleware.js';
import { Router } from 'express';

import { RecommendationsController } from './recommendations-controller.js';

const router = Router();
const controller = new RecommendationsController();

// All recommendation routes require authentication
router.use(protect);

router.get('/', controller.getRecommendations);

export const recommendationsRouter = router;
