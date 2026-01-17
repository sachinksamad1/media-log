import { protect } from '@common/middlewares/auth-middleware.js';
import { validate } from '@common/validators/validate-request.js';
import { upload } from '@config/firestorage.js';
import { FictionController } from '@modules/media/fiction/fiction-controller.js';
import {
  fictionIdValidator,
  completeFictionValidator,
  createFictionValidator,
  updateFictionValidator,
} from '@modules/media/fiction/fiction-validator.js';
import { Router } from 'express';

const router = Router();
const controller = new FictionController();

// Apply authentication middleware to all routes
router.use(protect);

router
  .route('/')
  .post(
    // 1. Process the multipart/form-data first to populate req.body
    upload.single('imageUrl'),
    // 2. Validate the populated body
    (req, res, next) => validate(createFictionValidator)(req, res, next),
    controller.create,
  )
  .get(controller.getAll);

router.patch(
  '/:id/complete',
  (req, res, next) => validate(completeFictionValidator)(req, res, next),
  controller.complete,
);

router
  .route('/:id')
  .get(
    (req, res, next) => validate(fictionIdValidator)(req, res, next),
    controller.getById,
  )
  .patch(
    // 1. Allow optional image updates
    upload.single('imageUrl'),
    // 2. Validate the update data
    (req, res, next) => validate(updateFictionValidator)(req, res, next),
    controller.update,
  )
  .delete(
    (req, res, next) => validate(fictionIdValidator)(req, res, next),
    controller.delete,
  );

export default router;
