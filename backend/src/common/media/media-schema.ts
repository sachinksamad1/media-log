import { z } from 'zod';

export const UserStatusEnum = z.enum([
  'Planned',
  'Watching',
  'Ongoing',
  'Completed',
  'Dropped',
  'On-Hold',
]);

export const MediaSchema = z.object({
  id: z.string().optional(),
  uid: z.string().min(1, 'User ID is required'),
  title: z.string().min(1, 'Title is required'),

  // Shared User Stats
  userStats: z
    .object({
      score: z.number().min(0).max(10).default(0),
      status: UserStatusEnum.default('Planned'),
    })
    .default({
      score: 0,
      status: 'Planned',
    }),

  // Centralized Image Handling
  imageUrl: z.url('Invalid image URL').optional().or(z.literal('')),

  // Automated Audit Info
  createdAt: z.preprocess(
    (arg) => (arg instanceof Date ? arg : new Date()),
    z.date(),
  ),
  updatedAt: z.preprocess(
    (arg) => (arg instanceof Date ? arg : new Date()),
    z.date(),
  ),
});

export type Media = z.infer<typeof MediaSchema>;
