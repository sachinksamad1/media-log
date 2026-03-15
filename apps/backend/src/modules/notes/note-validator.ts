import { createNoteSchema, updateNoteSchema } from '@media-log/shared-types';
import { z } from 'zod';

// Validation for CREATE note (POST)
export const createNoteValidator = z.object({
  body: createNoteSchema,
});

// Validation for UPDATE note (PUT)
export const updateNoteValidator = z.object({
  params: z.object({
    id: z.string().min(1, 'Note ID is required'),
  }),
  body: updateNoteSchema,
});

// Validation for GET/DELETE note by ID
export const noteIdValidator = z.object({
  params: z.object({
    id: z.string().min(1, 'Note ID is required'),
  }),
});

// Validation for GET notes by media ID
export const noteMediaIdValidator = z.object({
  params: z.object({
    mediaId: z.string().min(1, 'Media ID is required'),
  }),
});
