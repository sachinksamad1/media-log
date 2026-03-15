import { z } from "zod";

// =============================================================================
// NOTE SCHEMAS
// =============================================================================

export const createNoteSchema = z.object({
  mediaId: z.string().min(1, "Media ID is required"),
  mediaType: z.enum([
    "anime",
    "manga",
    "movie",
    "tvSeries",
    "fiction",
    "nonFiction",
    "lightNovel",
    "game",
  ]),
  title: z.string().min(1, "Note title is required"),
  content: z.string().min(1, "Note content cannot be empty"),
});

export const updateNoteSchema = z.object({
  title: z.string().min(1, "Note title is required").optional(),
  content: z.string().min(1, "Note content cannot be empty"),
});

export type CreateNoteDto = z.infer<typeof createNoteSchema>;
export type UpdateNoteDto = z.infer<typeof updateNoteSchema>;
