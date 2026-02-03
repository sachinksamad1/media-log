import { MediaRepository } from '@common/media/media-repository.js';
import type { NonFiction } from '@modules/media/non-fiction/non-fiction-schema.js';

export class NonFictionRepository extends MediaRepository<NonFiction> {
  constructor() {
    super('non_fiction');
  }

  getMediaType(): string {
    return 'non_fiction';
  }
}
