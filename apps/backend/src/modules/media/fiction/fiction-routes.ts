import { protect } from '@common/middlewares/auth-middleware.js';
import { fileUploadMiddleware } from '@common/middlewares/file-upload.js';
import { validate } from '@common/validators/validate-request.js';
import { FictionController } from '@modules/media/fiction/fiction-controller.js';
import {
  fictionIdValidator,
  completeFictionValidator,
  createFictionValidator,
  updateFictionValidator,
} from '@modules/media/fiction/fiction-validator.js';
import { Router } from 'express';

const router = Router();
const controller = new FictionController();

// Apply authentication middleware to all routes
router.use(protect);

/**
 * @openapi
 * /fiction:
 *   get:
 *     summary: Get all fiction
 *     tags: [Fiction]
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
 *         description: List of fiction
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create new fiction
 *     tags: [Fiction]
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
 *         description: Fiction created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router
  .route('/')
  .post(
    fileUploadMiddleware,
    validate(createFictionValidator),
    controller.create,
  )
  .get(controller.getAll);

/**
 * @openapi
 * /fiction/{id}/complete:
 *   patch:
 *     summary: Mark fiction as complete
 *     tags: [Fiction]
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
 *         description: Fiction marked as complete
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/:id/complete',
  validate(completeFictionValidator),
  controller.complete,
);

/**
 * @openapi
 * /fiction/{id}:
 *   get:
 *     summary: Get fiction by ID
 *     tags: [Fiction]
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
 *         description: Fiction details
 *       404:
 *         description: Fiction not found
 *       401:
 *         description: Unauthorized
 *   patch:
 *     summary: Update fiction
 *     tags: [Fiction]
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
 *         description: Fiction updated
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete fiction
 *     tags: [Fiction]
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
 *         description: Fiction deleted
 *       401:
 *         description: Unauthorized
 */
router
  .route('/:id')
  .get(validate(fictionIdValidator), controller.getById)
  .patch(
    fileUploadMiddleware,
    validate(updateFictionValidator),
    controller.update,
  )
  .delete(validate(fictionIdValidator), controller.delete);

export default router;
