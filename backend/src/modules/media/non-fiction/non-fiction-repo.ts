import { MediaRepository } from '../../../common/media/media-repository.js';

import type { NonFiction } from './non-fiction-schema.js';

export class NonFictionRepository extends MediaRepository<NonFiction> {
  constructor() {
    super('non_fiction');
  }

  getMediaType(): string {
    return 'non_fiction';
  }
}
