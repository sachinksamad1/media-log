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

router
  .route('/')
  .post(
    fileUploadMiddleware,
    validate(createTvSeriesValidator),
    controller.create,
  )
  .get(controller.getAll);

router.patch(
  '/:id/complete',
  validate(completeTvSeriesValidator),
  controller.complete,
);

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
