import { z } from "zod";

// =============================================================================
// USER STATUS ENUM
// =============================================================================

export const UserStatusEnum = z.enum([
  "Planned",
  "Watching",
  "Reading",
  "Playing",
  "Completed",
  "Dropped",
  "On-Hold",
]);

export type UserStatus = z.infer<typeof UserStatusEnum>;

// =============================================================================
// BASE USER STATS SCHEMA
// =============================================================================

export const BaseUserStatsSchema = z.object({
  score: z.number().min(0).max(10).default(0),
  status: UserStatusEnum.default("Planned"),
});

export type BaseUserStats = z.infer<typeof BaseUserStatsSchema>;

// =============================================================================
// BASE MEDIA SCHEMA
// =============================================================================

export const MediaBaseSchema = z.object({
  id: z.string().optional(),
  uid: z.string().min(1, "User ID is required"),
  title: z.string().min(1, "Title is required"),
  genres: z.array(z.string()).optional(),
  origin: z.string().optional(),
  language: z.string().optional(),
  userStats: BaseUserStatsSchema.default({
    score: 0,
    status: "Planned",
  }),
  imageUrl: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type MediaBase = z.infer<typeof MediaBaseSchema>;
