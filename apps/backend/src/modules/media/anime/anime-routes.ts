import { protect } from '@common/middlewares/auth-middleware.js';
import { fileUploadMiddleware } from '@common/middlewares/file-upload.js';
import { validate } from '@common/validators/validate-request.js';
import { AnimeController } from '@modules/media/anime/anime-controller.js';
import {
  animeIdValidator,
  completeAnimeValidator,
  createAnimeValidator,
  updateAnimeValidator,
} from '@modules/media/anime/anime-validator.js';
import { Router } from 'express';

const router = Router();
const controller = new AnimeController();

// Apply authentication middleware to all routes
router.use(protect);

/**
 * @openapi
 * /anime:
 *   get:
 *     summary: Get all anime
 *     tags: [Anime]
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
 *         description: List of anime
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create new anime
 *     tags: [Anime]
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
 *         description: Anime created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router
  .route('/')
  .post(fileUploadMiddleware, validate(createAnimeValidator), controller.create)
  .get(controller.getAll);

/**
 * @openapi
 * /anime/{id}/complete:
 *   patch:
 *     summary: Mark anime as complete
 *     tags: [Anime]
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
 *         description: Anime marked as complete
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/:id/complete',
  validate(completeAnimeValidator),
  controller.complete,
);

/**
 * @openapi
 * /anime/{id}:
 *   get:
 *     summary: Get anime by ID
 *     tags: [Anime]
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
 *         description: Anime details
 *       404:
 *         description: Anime not found
 *       401:
 *         description: Unauthorized
 *   patch:
 *     summary: Update anime
 *     tags: [Anime]
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
 *         description: Anime updated
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete anime
 *     tags: [Anime]
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
 *         description: Anime deleted
 *       401:
 *         description: Unauthorized
 */
router
  .route('/:id')
  .get(validate(animeIdValidator), controller.getById)
  .patch(
    fileUploadMiddleware,
    validate(updateAnimeValidator),
    controller.update,
  )
  .delete(validate(animeIdValidator), controller.delete);

export default router;
