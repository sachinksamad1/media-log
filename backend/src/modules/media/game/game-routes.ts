import { protect } from '@common/middlewares/auth-middleware.js';
import { fileUploadMiddleware } from '@common/middlewares/file-upload.js';
import { validate } from '@common/validators/validate-request.js';
import { GameController } from '@modules/media/game/game-controller.js';
import {
  gameIdValidator,
  completeGameValidator,
  createGameValidator,
  updateGameValidator,
} from '@modules/media/game/game-validator.js';
import { Router } from 'express';

const router = Router();
const controller = new GameController();

// Apply authentication middleware to all routes
router.use(protect);

router
  .route('/')
  .post(fileUploadMiddleware, validate(createGameValidator), controller.create)
  .get(controller.getAll);

router.patch(
  '/:id/complete',
  validate(completeGameValidator),
  controller.complete,
);

router
  .route('/:id')
  .get(validate(gameIdValidator), controller.getById)
  .patch(fileUploadMiddleware, validate(updateGameValidator), controller.update)
  .delete(validate(gameIdValidator), controller.delete);

export default router;
