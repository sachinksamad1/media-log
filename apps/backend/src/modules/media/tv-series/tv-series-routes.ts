import { protect } from '@common/middlewares/auth-middleware.js';
import { fileUploadMiddleware } from '@common/middlewares/file-upload.js';
import { validate } from '@common/validators/validate-request.js';
import { TvSeriesController } from '@modules/media/tv-series/tv-series-controller.js';
import {
  createTvSeriesValidator,
  updateTvSeriesValidator,
  tvSeriesIdValidator,
  completeTvSeriesValidator,
} from '@modules/media/tv-series/tv-series-validator.js';
import { Router } from 'express';

const router = Router();
const controller = new TvSeriesController();

// Apply authentication middleware to all routes
router.use(protect);

/**
 * @openapi
 * /tv-series:
 *   get:
 *     summary: Get all TV series
 *     tags: [TV Series]
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
 *         description: List of TV series
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create new TV series
 *     tags: [TV Series]
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
 *         description: TV series created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router
  .route('/')
  .post(
    fileUploadMiddleware,
    validate(createTvSeriesValidator),
    controller.create,
  )
  .get(controller.getAll);

/**
 * @openapi
 * /tv-series/{id}/complete:
 *   patch:
 *     summary: Mark TV series as complete
 *     tags: [TV Series]
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
 *         description: TV series marked as complete
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/:id/complete',
  validate(completeTvSeriesValidator),
  controller.complete,
);

/**
 * @openapi
 * /tv-series/{id}:
 *   get:
 *     summary: Get TV series by ID
 *     tags: [TV Series]
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
 *         description: TV series details
 *       404:
 *         description: TV series not found
 *       401:
 *         description: Unauthorized
 *   patch:
 *     summary: Update TV series
 *     tags: [TV Series]
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
 *         description: TV series updated
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete TV series
 *     tags: [TV Series]
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
 *         description: TV series deleted
 *       401:
 *         description: Unauthorized
 */
router
  .route('/:id')
  .get(validate(tvSeriesIdValidator), controller.getById)
  .patch(
    fileUploadMiddleware,
    validate(updateTvSeriesValidator),
    controller.update,
  )
  .delete(validate(tvSeriesIdValidator), controller.delete);

export default router;
