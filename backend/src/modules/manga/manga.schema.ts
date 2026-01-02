import { z } from "zod";

export const MangaSchema = z.object({
  id: z.string().optional(), // Auto-assigned by Firestore
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  
  // Use arrays for multi-tag filtering (Action, Seinen, etc.)
  genres: z.array(z.string()).default([]), 
  
  // Better tracking for Manga specific progress
  currentChapter: z.number().int().min(0).default(0),
  currentVolume: z.number().int().min(0).default(0),
  totalVolumes: z.number().int().min(1).optional(),
  
  // Standardization of formats and types
  format: z.enum(["Physical", "Digital", "Magazine"]).default("Digital"),
  type: z.enum(["Manga", "Manhwa", "Manhua", "One-shot", "Doujinshi"]).default("Manga"),
  
  // Status tracking
  releaseStatus: z.enum(["Ongoing", "Completed", "Hiatus", "Cancelled"]).default("Ongoing"),
  readingStatus: z.enum(["Planned", "Reading", "Completed", "Dropped", "On Hold"]).default("Planned"),
  
  origin: z.string().default("Japan"), // e.g., Japan, South Korea, China
  score: z.number().min(0).max(10).default(0), // Personal rating
  imageUrl: z.string().url().optional().or(z.literal('')), // For cover art

  // Automated audit fields
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type Manga = z.infer<typeof MangaSchema>;