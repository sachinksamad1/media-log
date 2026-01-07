import { z } from "zod";

export const LightNovelSchema = z.object({
  // Basic Info
  id: z.string().optional(), // Auto-entry handled by Firestore/DB
  title: z.string().min(1, "Title is required"),

  // Categorization
  author: z.string().optional(),
  illustrator: z.string().optional(),
  origin: z.string().default("Japan"), // e.g., Japan, South Korea, China
  genres: z.array(z.string()).optional(),

  // Format & Type
  type: z.enum(["Series", "Standalone"]).optional().default("Series"),
  format: z
    .enum(["Web Novel", "Light Novel", "Physical", "Digital"])
    .optional().default("Light Novel"),

  // Release and Reading Status
  releaseStats: z.object({
    releaseStatus: z
      .enum(["Ongoing", "Completed", "Hiatus", "Cancelled"])
      .default("Ongoing"),
    chapters: z.number().int().min(1).default(1),
    volumes: z.number().int().min(1).default(1),
  }),

  // User Stats & Progress tracking
  userStats: z.object({
    currentReadingChapter: z.number().int().min(0),
    currentReadingVolume: z.number().int().min(0),
    score: z.number().min(0).max(10),
    status: z.enum(["Planned", "Ongoing", "Completed", "Dropped"]),
  }).default({
    currentReadingChapter: 1,
    currentReadingVolume: 1,
    score: 5,
    status: "Planned",
  }),

  // Poster & Image
  imageUrl: z.url().optional(),

  // Audit Info(Automated)
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type LightNovel = z.infer<typeof LightNovelSchema>;
