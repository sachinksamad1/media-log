import { z } from 'zod';

import { LightNovelSchema } from './light-novel-schema.js';

// 1. Validation for CREATE (POST)
export const createLightNovelValidator = z.object({
  body: LightNovelSchema.omit({
    id: true,
    uid: true,
    createdAt: true,
    updatedAt: true,
  }),
});

// 2. Validation for UPDATE (PATCH)
export const updateLightNovelValidator = z.object({
  params: z.object({
    id: z.string().min(1, 'ID parameter is required'),
  }),
  body: LightNovelSchema.omit({ uid: true }).partial(), // Makes all fields optional for partial updates
});

// 3. Validation for GET/DELETE by ID
export const lightNovelIdValidator = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
