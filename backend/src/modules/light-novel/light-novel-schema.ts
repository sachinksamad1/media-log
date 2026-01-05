import { z } from "zod";

export const LightNovelSchema = z.object({
  id: z.string().optional(), // Auto-entry handled by Firestore/DB
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  illustrator: z.string().optional(),
  origin: z.string().default("Japan"), // e.g., Japan, South Korea, China

  // Genres
  genres: z.array(z.string()).default([]),

  // Format
  format: z
    .enum(["Web Novel", "Light Novel", "Physical", "Digital"])
    .default("Light Novel"),

  // Specific media types
  type: z.enum(["Series", "Standalone"]).default("Series"),

  // Release and Reading Status
  releaseStats: z.object({
    publishedVolumes: z.number().int().min(1).default(1),
    releaseStatus: z
      .enum(["Ongoing", "Completed", "Hiatus", "Cancelled"])
      .default("Ongoing"),
  }),

  // Progress tracking
  userStats: z.object({
    score: z.number().min(0).max(10).default(0), // Added personal rating
    currentReadingVolume: z.number().int().min(0).default(0),
    readingStatus: z
      .enum(["Planned", "Reading", "Completed", "Dropped", "On Hold"])
      .default("Planned"),
  }),

  //Metadata
  metadata: z.object({
    imageUrl: z.string().url().optional().or(z.literal("")), // For Firebase Storage links
  }),

  // Audit fields for tracking
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date().default(() => new Date()),
});

export type LightNovel = z.infer<typeof LightNovelSchema>;
