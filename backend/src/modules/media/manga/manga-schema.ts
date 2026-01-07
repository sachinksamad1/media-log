import { z } from "zod";

export const MangaSchema = z.object({
  // Basic Info
  id: z.string().optional(), // Auto-entry handled by Firestore/DB
  title: z.string().min(1, "Title is required"),

  // Categorization
  author: z.string().min(1, "Author is required"),
  illustrator: z.string().optional(),
  origin: z.string().default("Japan"), // e.g., Japan, South Korea, China
  genres: z.array(z.string()).default([]),

  // Format & Type
  type: z.enum(["Manga", "Manhwa", "Manhua", "One-shot", "Doujinshi"]).default("Manga"),
  format: z.enum(["Physical", "Digital", "Magazine"]).default("Digital"),
  

  // Release and Reading Status
  releaseStats: z.object({
    publishedVolumes: z.number().int().min(1).default(1),
    releaseStatus: z
      .enum(["Ongoing", "Completed", "Hiatus", "Cancelled"])
      .default("Ongoing"),
  }),

  // Progress tracking
  userStats: z.object({
    score: z.number().min(0).max(10).default(5),
    currentChapter: z.number().int().min(0),
    currentVolume: z.number().int().min(0),
    totalVolumes: z.number().int().min(1).optional(),
    status: z.enum(["Planned", "Ongoing", "Completed", "Dropped"]).default("Planned"),
  }).default({
    score: 5,
    currentChapter: 1,
    currentVolume: 1,
    totalVolumes: 1,
    status: "Planned",
  }),

  //Poster & Image
  imageUrl: z.url().optional(),

  // Audit Info(Automated)
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type Manga = z.infer<typeof MangaSchema>;
