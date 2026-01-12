export type MediaStatus = 'Completed' | 'Ongoing' | 'Planned';

export interface LibraryStats {
  total: number;
  completed: number;
  ongoing: number;
  planned: number;
}

export type LibrarySummary = Record<string, LibraryStats>;
