import { LightNovelSchema } from '@modules/media/light-novel/light-novel-schema.js';
import { z } from 'zod';

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
  body: LightNovelSchema.omit({ uid: true }).partial(),
});

// 3. Validation for GET/DELETE by ID
export const lightNovelIdValidator = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

// 4. Validation for COMPLETE (PATCH)
export const completeLightNovelValidator = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    score: z.number().min(0).max(10).optional(),
  }),
});
