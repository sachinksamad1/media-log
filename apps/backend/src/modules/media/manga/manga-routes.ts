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

router
  .route('/')
  .post(fileUploadMiddleware, validate(createMangaValidator), controller.create)
  .get(controller.getAll);

router.patch(
  '/:id/complete',
  validate(completeMangaValidator),
  controller.complete,
);

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
