import { z } from 'zod';
import { MediaBaseSchema } from './media-base.schema';

// =============================================================================
// NON-FICTION SCHEMA
// =============================================================================

export const NonFictionVolumeSchema = z.object({
  standalone: z.boolean().default(true),
  seriesName: z.string().optional(),
  order: z.number().int().min(1).default(1),
  total: z.number().int().min(1).default(1),
  isCompleted: z.boolean().default(true),
});

export const NonFictionSchema = MediaBaseSchema.extend({
  author: z.string().optional(),
  format: z.string().optional(),
  published: z.date().optional().or(z.string().optional()),
  volumes: z.array(NonFictionVolumeSchema).default([]),
});

export type NonFictionVolume = z.infer<typeof NonFictionVolumeSchema>;
export type NonFiction = z.infer<typeof NonFictionSchema>;

// =============================================================================
// NON-FICTION DTO (for API responses)
// =============================================================================

export interface NonFictionDTO {
  id: string;
  title: string;
  genres: string[];
  origin?: string;
  language?: string;
  author?: string;
  format?: string;
  published?: string;
  volumes: Array<{
    standalone: boolean;
    seriesName?: string;
    order: number;
    total: number;
    isCompleted: boolean;
  }>;
  userStats: {
    score: number;
    status: string;
  };
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
