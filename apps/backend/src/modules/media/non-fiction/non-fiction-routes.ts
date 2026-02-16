import { protect } from '@common/middlewares/auth-middleware.js';
import { fileUploadMiddleware } from '@common/middlewares/file-upload.js';
import { validate } from '@common/validators/validate-request.js';
import { NonFictionController } from '@modules/media/non-fiction/non-fiction-controller.js';
import {
  nonFictionIdValidator,
  completeNonFictionValidator,
  createNonFictionValidator,
  updateNonFictionValidator,
} from '@modules/media/non-fiction/non-fiction-validator.js';
import { Router } from 'express';

const router = Router();
const controller = new NonFictionController();

// Apply authentication middleware to all routes
router.use(protect);

/**
 * @openapi
 * /non-fiction:
 *   get:
 *     summary: Get all non-fiction
 *     tags: [Non-Fiction]
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
 *         description: List of non-fiction
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create new non-fiction
 *     tags: [Non-Fiction]
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
 *         description: Non-fiction created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router
  .route('/')
  .post(
    fileUploadMiddleware,
    validate(createNonFictionValidator),
    controller.create,
  )
  .get(controller.getAll);

/**
 * @openapi
 * /non-fiction/{id}/complete:
 *   patch:
 *     summary: Mark non-fiction as complete
 *     tags: [Non-Fiction]
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
 *         description: Non-fiction marked as complete
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/:id/complete',
  validate(completeNonFictionValidator),
  controller.complete,
);

/**
 * @openapi
 * /non-fiction/{id}:
 *   get:
 *     summary: Get non-fiction by ID
 *     tags: [Non-Fiction]
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
 *         description: Non-fiction details
 *       404:
 *         description: Non-fiction not found
 *       401:
 *         description: Unauthorized
 *   patch:
 *     summary: Update non-fiction
 *     tags: [Non-Fiction]
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
 *         description: Non-fiction updated
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete non-fiction
 *     tags: [Non-Fiction]
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
 *         description: Non-fiction deleted
 *       401:
 *         description: Unauthorized
 */
router
  .route('/:id')
  .get(validate(nonFictionIdValidator), controller.getById)
  .patch(
    fileUploadMiddleware,
    validate(updateNonFictionValidator),
    controller.update,
  )
  .delete(validate(nonFictionIdValidator), controller.delete);

export default router;
