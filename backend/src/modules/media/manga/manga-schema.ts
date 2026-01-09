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
  type: z.enum(["Manga", "Manhwa", "Manhua", "One-shot", "Doujinshi"]).default("Manga"),
  format: z.enum(["Physical", "Digital", "Magazine"]).default("Digital"),

  // Release and Reading Status
  releaseStats: z.object({
    publishedVolumes: z.number().int().min(1).default(1),
    releaseStatus: z
      .enum(["Ongoing", "Completed", "Hiatus", "Cancelled"])
      .default("Ongoing"),
  }),

  readingStats: z.object({
    currentReadingChapter: z.number().int().min(0),
    currentReadingVolume: z.number().int().min(0),
  }).default({
    currentReadingChapter: 0,
    currentReadingVolume: 0,
  }),

  // Progress tracking
  userStats: z.object({
    score: z.number().min(0).max(10).default(5),
    status: z.enum(["Planned", "Ongoing", "Completed", "Dropped"]).default("Planned"),
  }).default({
    score: 5,
    status: "Planned",
  }),

  //Poster & Image
  imageUrl: z.url().optional(),

  // Audit Info(Automated)
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type Manga = z.infer<typeof MangaSchema>;
