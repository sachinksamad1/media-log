import type { MediaRepository } from '../../common/media/media-repository.js';

import type {
  LibraryStats,
  LibrarySummary,
  MediaStatus,
} from './dashboard-types.js';

export class DashboardService {
  constructor(
    private readonly repos: Record<string, MediaRepository<unknown>>,
  ) {}

  async getLibrarySummary(): Promise<LibrarySummary> {
    const summaryEntries = await Promise.all(
      Object.entries(this.repos).map(async ([key, repo]) => {
        const [total, completed, ongoing] = await Promise.all([
          repo.getCount(),
          repo.getCountByStatus('Completed' as MediaStatus),
          repo.getCountByStatus('Ongoing' as MediaStatus),
        ]);

        const stats: LibraryStats = {
          total,
          completed,
          ongoing,
          planned: total - (completed + ongoing),
        };

        return [key, stats] as const;
      }),
    );

    return Object.fromEntries(summaryEntries);
  }
}
