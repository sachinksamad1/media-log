import { protect } from '@common/middlewares/auth-middleware.js';
import { fileUploadMiddleware } from '@common/middlewares/file-upload.js';
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

// Apply authentication middleware to all routes
router.use(protect);

router
  .route('/')
  .post(
    fileUploadMiddleware,
    validate(createLightNovelValidator),
    controller.create,
  )
  .get(controller.getAll);

router
  .route('/:id')
  .get(validate(lightNovelIdValidator), controller.getById) // Get specific
  .patch(
    fileUploadMiddleware,
    validate(updateLightNovelValidator),
    controller.update,
  ) // Update specific
  .delete(validate(lightNovelIdValidator), controller.delete); // Delete specific

export default router;
