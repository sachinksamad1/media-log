import type { MediaDTO } from '../media/media-dto.js';

export interface GlobalSearchResponse extends MediaDTO {
  mediaType: string;
}
