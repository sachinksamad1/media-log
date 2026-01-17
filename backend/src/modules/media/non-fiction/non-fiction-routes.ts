import { protect } from '@common/middlewares/auth-middleware.js';
import { validate } from '@common/validators/validate-request.js';
import { upload } from '@config/firestorage.js';
import { NonFictionController } from '@modules/media/non-fiction/non-fiction-controller.js';
import {
  nonFictionIdValidator,
  completeNonFictionValidator,
  createNonFictionValidator,
  updateNonFictionValidator,
} from '@modules/media/non-fiction/non-fiction-validator.js';
import { Router } from 'express';

const router = Router();
const controller = new NonFictionController();

// Apply authentication middleware to all routes
router.use(protect);

router
  .route('/')
  .post(
    // 1. Process the multipart/form-data first to populate req.body
    upload.single('imageUrl'),
    // 2. Validate the populated body
    (req, res, next) => validate(createNonFictionValidator)(req, res, next),
    controller.create,
  )
  .get(controller.getAll);

router.patch(
  '/:id/complete',
  (req, res, next) => validate(completeNonFictionValidator)(req, res, next),
  controller.complete,
);

router
  .route('/:id')
  .get(
    (req, res, next) => validate(nonFictionIdValidator)(req, res, next),
    controller.getById,
  )
  .patch(
    // 1. Allow optional image updates
    upload.single('imageUrl'),
    // 2. Validate the update data
    (req, res, next) => validate(updateNonFictionValidator)(req, res, next),
    controller.update,
  )
  .delete(
    (req, res, next) => validate(nonFictionIdValidator)(req, res, next),
    controller.delete,
  );

export default router;
