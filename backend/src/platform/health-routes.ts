import { Router } from 'express';

import { getHealth } from '@/platform/health-contrtoller.js';

const router = Router();
router.get('/', getHealth);

export default router;
