import { Router } from 'express';
import multer from 'multer';

import { protect } from '../../common/middlewares/auth-middleware.js';

import { usersController } from './users-controller.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Public routes
router.post('/signup', usersController.register);
router.post('/recover/username', usersController.recoverUsername);

// Protect all user routes with Firebase Auth
router.use(protect);

router.post('/sync', usersController.syncUser);
router.get('/me', usersController.getMe);
router.patch('/me', usersController.updateMe);
router.post(
  '/me/avatar',
  upload.single('avatar'),
  usersController.uploadAvatar,
);

export default router;
