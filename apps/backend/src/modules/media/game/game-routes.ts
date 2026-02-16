import { protect } from '@common/middlewares/auth-middleware.js';
import { fileUploadMiddleware } from '@common/middlewares/file-upload.js';
import { validate } from '@common/validators/validate-request.js';
import { GameController } from '@modules/media/game/game-controller.js';
import {
  gameIdValidator,
  completeGameValidator,
  createGameValidator,
  updateGameValidator,
} from '@modules/media/game/game-validator.js';
import { Router } from 'express';

const router = Router();
const controller = new GameController();

// Apply authentication middleware to all routes
router.use(protect);

/**
 * @openapi
 * /games:
 *   get:
 *     summary: Get all games
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of games
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create new game
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Game created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router
  .route('/')
  .post(fileUploadMiddleware, validate(createGameValidator), controller.create)
  .get(controller.getAll);

/**
 * @openapi
 * /games/{id}/complete:
 *   patch:
 *     summary: Mark game as complete
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Game marked as complete
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/:id/complete',
  validate(completeGameValidator),
  controller.complete,
);

/**
 * @openapi
 * /games/{id}:
 *   get:
 *     summary: Get game by ID
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Game details
 *       404:
 *         description: Game not found
 *       401:
 *         description: Unauthorized
 *   patch:
 *     summary: Update game
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Game updated
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete game
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Game deleted
 *       401:
 *         description: Unauthorized
 */
router
  .route('/:id')
  .get(validate(gameIdValidator), controller.getById)
  .patch(fileUploadMiddleware, validate(updateGameValidator), controller.update)
  .delete(validate(gameIdValidator), controller.delete);

export default router;
