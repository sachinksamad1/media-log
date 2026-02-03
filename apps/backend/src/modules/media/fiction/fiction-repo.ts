import { MediaRepository } from '@common/media/media-repository.js';
import type { Fiction } from '@modules/media/fiction/fiction-schema.js';

export class FictionRepository extends MediaRepository<Fiction> {
  constructor() {
    super('fiction');
  }

  getMediaType(): string {
    return 'fiction';
  }
}
