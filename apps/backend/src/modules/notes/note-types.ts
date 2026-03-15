import type { Note } from '@media-log/shared-types';

// Backend-specific DB note with required dates
export interface DbNote extends Note {
  createdAt: Date;
  updatedAt: Date;
}
