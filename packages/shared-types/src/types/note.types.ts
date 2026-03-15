import type { MediaTypeKey } from "./media.types.js";

/**
 * Represents a note attached to a media entry
 */
export interface Note {
  id?: string;
  mediaId: string;
  mediaType: MediaTypeKey;
  userId: string;
  title: string;
  content: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
