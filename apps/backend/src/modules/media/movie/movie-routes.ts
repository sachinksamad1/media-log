import { protect } from '@common/middlewares/auth-middleware.js';
import { fileUploadMiddleware } from '@common/middlewares/file-upload.js';
import { validate } from '@common/validators/validate-request.js';
import { MovieController } from '@modules/media/movie/movie-controller.js';
import {
  movieIdValidator,
  createMovieValidator,
  completeMovieValidator,
  updateMovieValidator,
} from '@modules/media/movie/movie-validator.js';
import { Router } from 'express';

const router = Router();
const controller = new MovieController();

// Apply authentication middleware to all routes
router.use(protect);

/**
 * @openapi
 * /movie:
 *   get:
 *     summary: Get all movies
 *     tags: [Movies]
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
 *         description: List of movies
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create new movie
 *     tags: [Movies]
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
 *         description: Movie created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router
  .route('/')
  .post(fileUploadMiddleware, validate(createMovieValidator), controller.create)
  .get(controller.getAll);

/**
 * @openapi
 * /movie/{id}/complete:
 *   patch:
 *     summary: Mark movie as complete
 *     tags: [Movies]
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
 *         description: Movie marked as complete
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/:id/complete',
  validate(completeMovieValidator),
  controller.complete,
);

/**
 * @openapi
 * /movie/{id}:
 *   get:
 *     summary: Get movie by ID
 *     tags: [Movies]
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
 *         description: Movie details
 *       404:
 *         description: Movie not found
 *       401:
 *         description: Unauthorized
 *   patch:
 *     summary: Update movie
 *     tags: [Movies]
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
 *         description: Movie updated
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete movie
 *     tags: [Movies]
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
 *         description: Movie deleted
 *       401:
 *         description: Unauthorized
 */
router
  .route('/:id')
  .get(validate(movieIdValidator), controller.getById)
  .patch(
    fileUploadMiddleware,
    validate(updateMovieValidator),
    controller.update,
  )
  .delete(validate(movieIdValidator), controller.delete);

export default router;
