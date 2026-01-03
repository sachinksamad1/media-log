import { z } from "zod";

export const AnimeSchema = z.object({
  id: z.string().optional(), // Added by Firestore
  title: z.string().min(1, "Title is required"),
  genre: z.array(z.string()).min(1, "At least one genre is required"),
  origin: z.string().min(1, "Origin is required"),
  language: z.string().min(1, "Language is required"),
  
  animeStats: z.object({
    currentSeason: z.number().int().min(0),
    totalSeasons: z.number().int().min(1),
    isCompleted: z.boolean().default(false),
  }),

  userStats: z.object({
    score: z.number().min(0).max(10).default(0),
    status: z.enum(["Planned", "Watching", "Completed", "Dropped", "On-Hold"]),
  }),

  imageUrl: z.string().url("Invalid image URL").optional(),
  createdAt: z.string().datetime().optional(), // Or z.date() if using native JS dates
  updatedAt: z.string().datetime().optional(),
});

// Extract the type from the schema for use in Services/Repos
export type Anime = z.infer<typeof AnimeSchema>;