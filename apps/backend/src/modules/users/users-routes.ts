import { protect } from '@common/middlewares/auth-middleware.js';
import { fileUploadMiddleware } from '@common/middlewares/file-upload.js';
import { usersController } from '@modules/users/users-controller.js';
import { Router } from 'express';

const router = Router();

// Public routes
/**
 * @openapi
 * /users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.post('/signup', usersController.register);

router.post('/recover/username', usersController.recoverUsername);

// Protect all user routes with Firebase Auth
router.use(protect);

router.post('/sync', usersController.syncUser);

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 username:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/me', usersController.getMe);
router.patch('/me', usersController.updateMe);
router.post('/me/avatar', fileUploadMiddleware, usersController.uploadAvatar);

export default router;
