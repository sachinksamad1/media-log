import { Router } from 'express';

import { validate } from '../../../common/validators/validate-request.js';

import { NonFictionController } from './non-fiction-controller.js';
import {
  createNonFictionValidator,
  updateNonFictionValidator,
  nonFictionIdValidator,
} from './non-fiction-validator.js';

const router = Router();
const controller = new NonFictionController();

router
  .route('/')
  .post(
    (req, res, next) => validate(createNonFictionValidator)(req, res, next),
    controller.create,
  )
  .get(controller.getAll);

router
  .route('/:id')
  .get(
    (req, res, next) => validate(nonFictionIdValidator)(req, res, next),
    controller.getById,
  ) // Get specific
  .patch(
    (req, res, next) => validate(updateNonFictionValidator)(req, res, next),
    controller.update,
  ) // Update specific
  .delete(
    (req, res, next) => validate(nonFictionIdValidator)(req, res, next),
    controller.delete,
  ); // Delete specific

export default router;
