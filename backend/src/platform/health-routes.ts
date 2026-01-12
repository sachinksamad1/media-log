import { Router } from 'express';

import { getHealth } from './health-contrtoller.js';

const router = Router();
router.get('/', getHealth);

export default router;
