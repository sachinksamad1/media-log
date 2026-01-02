import { z } from 'zod';

export const AnimeSchema = z.object({
  id: z.string().optional(), // Auto-assigned by Firestore
  
  title: z.string().min(1, "Title is required"),
  genre: z.array(z.string()),
  origin: z.string().default("Japan"),
  language: z.string().default("Japanese"),
  
  // Progress tracking
  progress: z.object({
    currentSeason: z.number().int().min(0).default(1),
    totalSeasons: z.number().int().min(1).default(1),
  }),
  
  // User stats
  userStats: z.object({
    score: z.number().min(0).max(10).default(0),
    status: z.enum(["Watching", "Plan to Watch", "Completed", "Dropped"]).default("Watching"),
    isCompleted: z.boolean().default(false),
  }),
  
  // Audit fields
  imageUrl: z.string().url().optional().or(z.literal('')),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// Infer the type for your Service and Repository
export type Anime = z.infer<typeof AnimeSchema>;