import { protect } from '@common/middlewares/auth-middleware.js';
import { fileUploadMiddleware } from '@common/middlewares/file-upload.js';
import { validate } from '@common/validators/validate-request.js';
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
    fileUploadMiddleware,
    validate(createFictionValidator),
    controller.create,
  )
  .get(controller.getAll);

router.patch(
  '/:id/complete',
  validate(completeFictionValidator),
  controller.complete,
);

router
  .route('/:id')
  .get(validate(fictionIdValidator), controller.getById)
  .patch(
    fileUploadMiddleware,
    validate(updateFictionValidator),
    controller.update,
  )
  .delete(validate(fictionIdValidator), controller.delete);

export default router;
