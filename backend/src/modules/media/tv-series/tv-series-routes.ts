import { protect } from '@common/middlewares/auth-middleware.js';
import { validate } from '@common/validators/validate-request.js';
import { upload } from '@config/firestorage.js';
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
    // 1. Process the multipart/form-data first to populate req.body
    upload.single('imageUrl'),
    // 2. Validate the populated body
    (req, res, next) => validate(createTvSeriesValidator)(req, res, next),
    controller.create,
  )
  .get(controller.getAll);

router.patch(
  '/:id/complete',
  (req, res, next) => validate(completeTvSeriesValidator)(req, res, next),
  controller.complete,
);

router
  .route('/:id')
  .get(
    (req, res, next) => validate(tvSeriesIdValidator)(req, res, next),
    controller.getById,
  )
  .patch(
    // 1. Allow optional image updates
    upload.single('imageUrl'),
    // 2. Validate the update data
    (req, res, next) => validate(updateTvSeriesValidator)(req, res, next),
    controller.update,
  )
  .delete(
    (req, res, next) => validate(tvSeriesIdValidator)(req, res, next),
    controller.delete,
  );

export default router;
