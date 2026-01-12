import { Router } from 'express';

import { catchAsync } from '../utils/catch-async.js';

import { globalSearch } from './search-controller.js';

const router = Router();

router.get('/', catchAsync(globalSearch));

export default router;
