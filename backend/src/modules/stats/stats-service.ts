import type { MediaRepository } from '@common/media/media-repository.js';
import type { BaseMediaType } from '@common/media/media-types.js';
import type { MediaStatus, LibraryStats } from '@modules/dashboard/dashboard-types.js';

export interface StatsSummary {
  // Summary cards data
  totalItems: number;
  currentlyWatching: number; // Ongoing
  inBacklog: number; // Planned
  completed: number;
  avgProgress: number; // percentage
  completionRate: number; // percentage

  // Media by category (for donut chart)
  byCategory: Record<string, number>;

  // Media by status (for bar chart)
  byStatus: {
    ongoing: number;
    planned: number;
    completed: number;
  };

  // Completion rate by category (for radial chart)
  completionByCategory: Record<string, number>;

  // Detailed stats per category
  categoryStats: Record<string, LibraryStats>;
}

export class StatsService {
  constructor(
    private readonly repos: Record<string, MediaRepository<BaseMediaType>>,
  ) {}

  async getStatsSummary(userId: string): Promise<StatsSummary> {
    const categoryStats: Record<string, LibraryStats> = {};
    const byCategory: Record<string, number> = {};
    const completionByCategory: Record<string, number> = {};

    let totalItems = 0;
    let totalOngoing = 0;
    let totalPlanned = 0;
    let totalCompleted = 0;

    // Fetch stats for each media type
    await Promise.all(
      Object.entries(this.repos).map(async ([key, repo]) => {
        const [total, completed, ongoing] = await Promise.all([
          repo.getCount(userId),
          repo.getCountByStatus('Completed' as MediaStatus, userId),
          repo.getCountByStatus('Ongoing' as MediaStatus, userId),
        ]);

        const planned = total - (completed + ongoing);

        const stats: LibraryStats = {
          total,
          completed,
          ongoing,
          planned,
        };

        categoryStats[key] = stats;
        byCategory[key] = total;

        // Calculate completion rate for category
        completionByCategory[key] = total > 0 ? Math.round((completed / total) * 100) : 0;

        totalItems += total;
        totalOngoing += ongoing;
        totalPlanned += planned;
        totalCompleted += completed;
      }),
    );

    // Calculate averages and rates
    const completionRate = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;

    // For avg progress, we'd need actual progress data from each item
    // For now, we'll estimate based on completion + half of ongoing
    const estimatedProgress = totalCompleted + totalOngoing * 0.5;
    const avgProgress = totalItems > 0 ? Math.round((estimatedProgress / totalItems) * 100) : 0;

    return {
      totalItems,
      currentlyWatching: totalOngoing,
      inBacklog: totalPlanned,
      completed: totalCompleted,
      avgProgress,
      completionRate,
      byCategory,
      byStatus: {
        ongoing: totalOngoing,
        planned: totalPlanned,
        completed: totalCompleted,
      },
      completionByCategory,
      categoryStats,
    };
  }
}
