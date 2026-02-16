import { protect } from '@common/middlewares/auth-middleware.js';
import { fileUploadMiddleware } from '@common/middlewares/file-upload.js';
import { validate } from '@common/validators/validate-request.js';
import { MangaController } from '@modules/media/manga/manga-controller.js';
import {
  mangaIdValidator,
  completeMangaValidator,
  createMangaValidator,
  updateMangaValidator,
} from '@modules/media/manga/manga-validator.js';
import { Router } from 'express';

const router = Router();
const controller = new MangaController();

// Apply authentication middleware to all routes
router.use(protect);

/**
 * @openapi
 * /manga:
 *   get:
 *     summary: Get all manga
 *     tags: [Manga]
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
 *         description: List of manga
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create new manga
 *     tags: [Manga]
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
 *         description: Manga created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router
  .route('/')
  .post(fileUploadMiddleware, validate(createMangaValidator), controller.create)
  .get(controller.getAll);

/**
 * @openapi
 * /manga/{id}/complete:
 *   patch:
 *     summary: Mark manga as complete
 *     tags: [Manga]
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
 *         description: Manga marked as complete
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/:id/complete',
  validate(completeMangaValidator),
  controller.complete,
);

/**
 * @openapi
 * /manga/{id}:
 *   get:
 *     summary: Get manga by ID
 *     tags: [Manga]
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
 *         description: Manga details
 *       404:
 *         description: Manga not found
 *       401:
 *         description: Unauthorized
 *   patch:
 *     summary: Update manga
 *     tags: [Manga]
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
 *         description: Manga updated
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete manga
 *     tags: [Manga]
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
 *         description: Manga deleted
 *       401:
 *         description: Unauthorized
 */
router
  .route('/:id')
  .get(validate(mangaIdValidator), controller.getById)
  .patch(
    fileUploadMiddleware,
    validate(updateMangaValidator),
    controller.update,
  )
  .delete(validate(mangaIdValidator), controller.delete);

export default router;
