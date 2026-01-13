import type { BaseMedia } from "../../common/types/media";

export interface Manga extends BaseMedia {
  author: string;
  totalChapters: number;
  chaptersRead: number;
}
