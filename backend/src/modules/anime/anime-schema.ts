import { z } from "zod";

export const AnimeSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  episodes: z.number().int().min(0).default(0),
  status: z.enum(["Watching", "Completed", "Plan to Watch"]).default("Plan to Watch"),
  score: z.number().min(0).max(10).default(0),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Anime = z.infer<typeof AnimeSchema>;