import { Router } from 'express';

import { validate } from '../../../common/validators/validate-request.js';

import { TvSeriesController } from './tv-series-controller.js';
import {
  createTvSeriesValidator,
  updateTvSeriesValidator,
  tvSeriesIdValidator,
} from './tv-series-validator.js';

const router = Router();
const controller = new TvSeriesController();

router
  .route('/')
  .post(
    (req, res, next) => validate(createTvSeriesValidator)(req, res, next),
    controller.create,
  )
  .get(controller.getAll);

router
  .route('/:id')
  .get(
    (req, res, next) => validate(tvSeriesIdValidator)(req, res, next),
    controller.getById,
  ) // Get specific
  .patch(
    (req, res, next) => validate(updateTvSeriesValidator)(req, res, next),
    controller.update,
  ) // Update specific
  .delete(
    (req, res, next) => validate(tvSeriesIdValidator)(req, res, next),
    controller.delete,
  ); // Delete specific

export default router;
