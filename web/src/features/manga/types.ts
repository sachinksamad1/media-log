import type { BaseMedia } from "../../types/media";

export interface Manga extends BaseMedia {
  author: string;
  totalChapters: number;
  chaptersRead: number;
}
