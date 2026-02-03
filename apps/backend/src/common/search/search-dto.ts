import type { MediaDTO } from '@/common/media/media-dto.js';

export interface GlobalSearchResponse extends MediaDTO {
  mediaType: string;
}
