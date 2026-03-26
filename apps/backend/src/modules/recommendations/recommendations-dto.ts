import { MediaBaseSchema } from '@media-log/shared-types/schemas';
import { z } from 'zod';

export const RecommendationQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(10),
});

export type RecommendationQuery = z.infer<typeof RecommendationQuerySchema>;

export const RecommendationResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(
    MediaBaseSchema.extend({
      score: z.number().describe('Recommendation relevance score'),
    }),
  ),
});

export type RecommendationResponse = z.infer<
  typeof RecommendationResponseSchema
>;
