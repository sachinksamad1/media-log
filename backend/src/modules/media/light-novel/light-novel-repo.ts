import { MediaRepository } from '../../../common/media/media-repository.js';

import type { LightNovel } from './light-novel-schema.js';

export class LightNovelRepository extends MediaRepository<LightNovel> {
  constructor() {
    super('light_novel');
  }

  getMediaType(): string {
    return 'light_novel';
  }
}
