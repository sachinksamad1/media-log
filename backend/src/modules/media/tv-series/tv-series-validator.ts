import { z } from 'zod';

import { TvSeriesSchema } from './tv-series-schema.js';

// 1. Validation for CREATE (POST)
export const createTvSeriesValidator = z.object({
  body: TvSeriesSchema.omit({
    id: true,
    uid: true,
    createdAt: true,
    updatedAt: true,
  }),
});

// 2. Validation for UPDATE (PATCH)
export const updateTvSeriesValidator = z.object({
  params: z.object({
    id: z.string().min(1, 'ID parameter is required'),
  }),
  body: TvSeriesSchema.omit({ uid: true }).partial(), // Makes all fields optional for partial updates
});

// 3. Validation for GET/DELETE by ID
export const tvSeriesIdValidator = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
