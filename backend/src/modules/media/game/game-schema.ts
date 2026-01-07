import { z } from "zod";

export const GameSchema = z.object({
  // Basic Info
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
 
  // Categorization
  category: {
    genres: z.array(z.string()).optional(),
    platforms: z
    .array(z.enum(["PC", "Xbox", "PlayStation", "Switch", "Mobile", "Other"]))
    .optional(),
    format: z.enum(["Digital", "Physical"]).default("Digital"),
    type: z
    .enum(["Base Game", "DLC", "Expansion", "Remake", "Remaster"])
    .default("Base Game"),
  },
  
  // Game Publication Info
  publicationInfo: z.object({
    developer: z.string().optional(),
    publisher: z.string().optional(),
    releaseDate: z.date().optional().or(z.string().regex(/\d{4}/)),
    status: z.enum(["Released", "Early Access", "Cancelled", "Upcoming"]).default("Released"),
  }),

  // Game Playthroughs
  playthroughs: z
    .array(
      z.object({
        gameOwned: z.number().int().min(1).default(1),
        totalGames: z.number().int().min(1).default(1),
        platformUsed: z.enum(["PC", "Xbox", "PlayStation"]).optional(),
        isCompleted: z.boolean().default(false),
        achievementsUnlocked: z.number().int().min(0).optional(),
        totalAchievements: z.number().int().min(1).optional(),
      })
    )
    .default([]),

  // User Stats
  userStats: z
    .object({
      score: z.number().min(0).max(10),
      status: z.enum(["Planned", "Ongoing", "Completed", "Dropped"]),
    })
    .default({
      score: 5,
      status: "Planned",
    }),

  // Poster Image
  imageUrl: z.url().optional(),

 // Audit Info(Automated)
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type Games = z.infer<typeof GameSchema>;
