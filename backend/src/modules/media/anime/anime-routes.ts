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

router
  .route('/')
  .post(fileUploadMiddleware, validate(createAnimeValidator), controller.create)
  .get(controller.getAll);

router.patch(
  '/:id/complete',
  validate(completeAnimeValidator),
  controller.complete,
);

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
