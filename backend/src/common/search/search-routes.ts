import { Router } from 'express';

import { protect } from '../middlewares/auth-middleware.js';
import { catchAsync } from '../utils/catch-async.js';

import { globalSearch } from './search-controller.js';

const router = Router();

router.get('/', protect, catchAsync(globalSearch));

export default router;
