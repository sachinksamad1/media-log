import type { MediaRepository } from '@common/media/media-repository.js';
import type {
  BaseMediaType,
  MediaCategoryStats,
  LibrarySummary,
} from '@common/media/media-types.js';

export class DashboardService {
  constructor(
    private readonly repos: Record<string, MediaRepository<BaseMediaType>>,
  ) {}

  async getLibrarySummary(userId: string): Promise<LibrarySummary> {
    const summaryEntries = await Promise.all(
      Object.entries(this.repos).map(async ([key, repo]) => {
        const [total, completed, ongoing] = await Promise.all([
          repo.getCount(userId),
          repo.getCountByStatus('Completed', userId),
          repo.getCountByStatus('Ongoing', userId),
        ]);

        const stats: MediaCategoryStats = {
          total,
          completed,
          ongoing,
          planned: total - (completed + ongoing),
        };

        return [key, stats] as const;
      }),
    );

    return Object.fromEntries(summaryEntries) as LibrarySummary;
  }
}
