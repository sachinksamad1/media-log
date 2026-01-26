import { protect } from '@common/middlewares/auth-middleware.js';
import { fileUploadMiddleware } from '@common/middlewares/file-upload.js';
import { validate } from '@common/validators/validate-request.js';
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
    fileUploadMiddleware,
    validate(createNonFictionValidator),
    controller.create,
  )
  .get(controller.getAll);

router.patch(
  '/:id/complete',
  validate(completeNonFictionValidator),
  controller.complete,
);

router
  .route('/:id')
  .get(validate(nonFictionIdValidator), controller.getById)
  .patch(
    fileUploadMiddleware,
    validate(updateNonFictionValidator),
    controller.update,
  )
  .delete(validate(nonFictionIdValidator), controller.delete);

export default router;
