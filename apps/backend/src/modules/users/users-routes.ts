import { protect } from '@common/middlewares/auth-middleware.js';
import { fileUploadMiddleware } from '@common/middlewares/file-upload.js';
import { usersController } from '@modules/users/users-controller.js';
import { Router } from 'express';

const router = Router();

// Public routes
router.post('/signup', usersController.register);
router.post('/recover/username', usersController.recoverUsername);

// Protect all user routes with Firebase Auth
router.use(protect);

router.post('/sync', usersController.syncUser);
router.get('/me', usersController.getMe);
router.patch('/me', usersController.updateMe);
router.post('/me/avatar', fileUploadMiddleware, usersController.uploadAvatar);

export default router;
