import { z } from 'zod';

import { NonFictionSchema } from './non-fiction-schema.js';

// 1. Validation for CREATE (POST)
export const createNonFictionValidator = z.object({
  body: NonFictionSchema.omit({
    id: true,
    uid: true,
    createdAt: true,
    updatedAt: true,
  }),
});

// 2. Validation for UPDATE (PATCH)
export const updateNonFictionValidator = z.object({
  params: z.object({
    id: z.string().min(1, 'ID parameter is required'),
  }),
  body: NonFictionSchema.omit({ uid: true }).partial(), // Makes all fields optional for partial updates
});

// 3. Validation for GET/DELETE by ID
export const nonFictionIdValidator = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
