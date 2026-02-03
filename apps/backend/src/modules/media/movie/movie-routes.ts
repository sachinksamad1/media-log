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

router
  .route('/')
  .post(fileUploadMiddleware, validate(createMovieValidator), controller.create)
  .get(controller.getAll);

router.patch(
  '/:id/complete',
  validate(completeMovieValidator),
  controller.complete,
);

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
