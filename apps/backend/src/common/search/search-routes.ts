import { Router } from 'express';

import { protect } from '@/common/middlewares/auth-middleware.js';
import {
  globalRandom,
  globalSearch,
} from '@/common/search/search-controller.js';
import { catchAsync } from '@/common/utils/catch-async.js';

const router = Router();

router.get('/random', protect, catchAsync(globalRandom));
router.get('/', protect, catchAsync(globalSearch));

export default router;
