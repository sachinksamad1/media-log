import { Router } from 'express';

import { protect } from '../../common/middlewares/auth-middleware.js';

import { usersController } from './users-controller.js';

const router = Router();

// Public routes
router.post('/signup', usersController.register);

// Protect all user routes with Firebase Auth
router.use(protect);

router.post('/sync', usersController.syncUser);
router.get('/me', usersController.getMe);
router.patch('/me', usersController.updateMe);

export default router;
