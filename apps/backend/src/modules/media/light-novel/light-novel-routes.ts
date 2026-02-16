import { protect } from '@common/middlewares/auth-middleware.js';
import { fileUploadMiddleware } from '@common/middlewares/file-upload.js';
import { validate } from '@common/validators/validate-request.js';
import { LightNovelController } from '@modules/media/light-novel/light-novel-controller.js';
import {
  createLightNovelValidator,
  updateLightNovelValidator,
  lightNovelIdValidator,
} from '@modules/media/light-novel/light-novel-validator.js';
import { Router } from 'express';

const router = Router();
const controller = new LightNovelController();

// Apply authentication middleware to all routes
router.use(protect);

/**
 * @openapi
 * /light-novel:
 *   get:
 *     summary: Get all light novels
 *     tags: [Light Novels]
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
 *         description: List of light novels
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create new light novel
 *     tags: [Light Novels]
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
 *         description: Light novel created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router
  .route('/')
  .post(
    fileUploadMiddleware,
    validate(createLightNovelValidator),
    controller.create,
  )
  .get(controller.getAll);

/**
 * @openapi
 * /light-novel/{id}:
 *   get:
 *     summary: Get light novel by ID
 *     tags: [Light Novels]
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
 *         description: Light novel details
 *       404:
 *         description: Light novel not found
 *       401:
 *         description: Unauthorized
 *   patch:
 *     summary: Update light novel
 *     tags: [Light Novels]
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
 *         description: Light novel updated
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete light novel
 *     tags: [Light Novels]
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
 *         description: Light novel deleted
 *       401:
 *         description: Unauthorized
 */
router
  .route('/:id')
  .get(validate(lightNovelIdValidator), controller.getById) // Get specific
  .patch(
    fileUploadMiddleware,
    validate(updateLightNovelValidator),
    controller.update,
  ) // Update specific
  .delete(validate(lightNovelIdValidator), controller.delete); // Delete specific

export default router;
