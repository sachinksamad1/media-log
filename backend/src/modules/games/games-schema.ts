import { z } from "zod";

export const GameSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  developer: z.string().min(1, "Developer is required"),
  publisher: z.string().optional(),
  releaseDate: z.date().optional().or(z.string().regex(/\d{4}/)),

  // Categorization
  genres: z.array(z.string()).default([]),
  platforms: z
    .array(z.enum(["PC", "Xbox", "PlayStation", "Switch", "Mobile"]))
    .min(1, "At least one platform is required"),
  format: z.enum(["Digital", "Physical"]).default("Digital"),
  type: z
    .enum(["Base Game", "DLC", "Expansion", "Remake", "Remaster"])
    .default("Base Game"),

  // Playthrough & DLC Tracking (Replacing Volumes)
  playthroughs: z
    .array(
      z.object({
        order: z.number().int().min(1).default(1), // e.g., Playthrough #1, NG+
        totalGames: z.number().int().min(1).default(1),
        platformUsed: z.enum(["PC", "Xbox", "PlayStation"]),
        isCompleted: z.boolean().default(false),
        achievementsUnlocked: z.number().int().min(0).optional(),
        totalAchievements: z.number().int().min(1).optional(),
      })
    )
    .default([]),

  // Status Tracking
  publicationStatus: z
    .enum(["Released", "Early Access", "Cancelled", "Upcoming"])
    .default("Released"),

  // User Stats
  userStats: z
    .object({
      score: z.number().min(0).max(10).default(0),
      playStatus: z
        .enum(["Planned", "Playing", "Completed", "Dropped", "On-Hold"])
        .default("Planned"),
    })
    .default({
      score: 0,
      playStatus: "Planned",
    }),

  // Metadata
  imageUrl: z.string().url().optional().or(z.literal("")),

  // Audit Fields
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type Games = z.infer<typeof GameSchema>;
