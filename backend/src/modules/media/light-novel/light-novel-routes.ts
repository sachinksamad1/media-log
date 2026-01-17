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

router
  .route('/')
  .post(
    (req, res, next) => validate(createLightNovelValidator)(req, res, next),
    controller.create,
  )
  .get(controller.getAll);

router
  .route('/:id')
  .get(
    (req, res, next) => validate(lightNovelIdValidator)(req, res, next),
    controller.getById,
  ) // Get specific
  .patch(
    (req, res, next) => validate(updateLightNovelValidator)(req, res, next),
    controller.update,
  ) // Update specific
  .delete(
    (req, res, next) => validate(lightNovelIdValidator)(req, res, next),
    controller.delete,
  ); // Delete specific

export default router;
