import { z } from "zod";

export const TvSeriesSchema = z.object({
  id: z.string().optional(), // Added by Firestore
  title: z.string().min(1, "Title is required"),
  genre: z.array(z.string()).min(1, "At least one genre is required"),
  director: z.array(z.string()).optional(),
  writer: z.array(z.string()).optional(),
  cast: z.array(z.string()).optional(),
  origin: z.string().min(1, "Origin is required"),
  language: z.string().min(1, "Language is required"),
  
  tvSeriesStats: z.object({
    initialSeasonRun:  z.string().regex(/^\d{4}$/),
    currentSeason: z.number().int().min(0),
    totalSeasons: z.number().int().min(1),
    isCompleted: z.boolean().default(false),
  }),

  userStats: z.object({
    score: z.number().min(0).max(10).default(0),
    status: z.enum(["Planned", "Watching", "Completed", "Dropped", "On-Hold"]),
  }),

  imageUrl: z.string().url("Invalid image URL").optional(),

  // Audit Info(Automated)
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type TvSeries = z.infer<typeof TvSeriesSchema>;