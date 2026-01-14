import type { MediaRepository } from '../../common/media/media-repository.js';
import type { BaseMediaType } from '../../common/media/media-types.js';

import type {
  LibraryStats,
  LibrarySummary,
  MediaStatus,
} from './dashboard-types.js';

export class DashboardService {
  constructor(
    private readonly repos: Record<string, MediaRepository<BaseMediaType>>,
  ) {}

  async getLibrarySummary(userId: string): Promise<LibrarySummary> {
    const summaryEntries = await Promise.all(
      Object.entries(this.repos).map(async ([key, repo]) => {
        const [total, completed, ongoing] = await Promise.all([
          repo.getCount(userId),
          repo.getCountByStatus('Completed' as MediaStatus, userId),
          repo.getCountByStatus('Ongoing' as MediaStatus, userId),
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
