import { protect } from '@common/middlewares/auth-middleware.js';
import { validate } from '@common/validators/validate-request.js';
import { Router } from 'express';

import { NoteController } from './note-controller.js';
import {
  createNoteValidator,
  updateNoteValidator,
  noteIdValidator,
  noteMediaIdValidator,
} from './note-validator.js';

const router = Router();
const controller = new NoteController();

// Apply authentication middleware to all routes
router.use(protect);

// Create note
router.post('/', validate(createNoteValidator), controller.create);

// Get notes by media ID
router.get(
  '/media/:mediaId',
  validate(noteMediaIdValidator),
  controller.getByMediaId,
);

// Update note
router.put('/:id', validate(updateNoteValidator), controller.update);

// Delete note
router.delete('/:id', validate(noteIdValidator), controller.delete);

export default router;
