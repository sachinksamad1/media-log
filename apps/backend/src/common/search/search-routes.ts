import { Router } from 'express';

import { protect } from '@/common/middlewares/auth-middleware.js';
import { globalSearch } from '@/common/search/search-controller.js';
import { catchAsync } from '@/common/utils/catch-async.js';

const router = Router();

router.get('/', protect, catchAsync(globalSearch));

export default router;
