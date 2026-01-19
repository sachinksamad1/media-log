import { z } from 'zod';

export const UserActivitySchema = z.object({
  // Auto-generated ID
  id: z.string().optional(),
  userId: z.string(),
  action: z.enum(['CREATE', 'UPDATE', 'DELETE', 'COMPLETE']),
  resourceType: z.string(), // E.g., 'Fiction', 'Anime'
  resourceId: z.string(),
  resourceTitle: z.string().optional(), // Store title to avoid fetching resource just for display
  details: z.string().optional(),
  createdAt: z.date().default(() => new Date()), // Timestamp
});

export type UserActivity = z.infer<typeof UserActivitySchema>;
