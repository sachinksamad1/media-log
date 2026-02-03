import type { MediaRepository } from '@common/media/media-repository.js';
import type { BaseMediaType } from '@common/media/media-types.js';

import type {
  ReportFilters,
  ReportPagination,
  ReportResponse,
  ReportItem,
  ReportSummary,
  MediaWithMetadata,
} from './report-types.js';

export class ReportService {
  private readonly mediaTypeLabels: Record<string, string> = {
    anime: 'Anime',
    manga: 'Manga',
    fiction: 'Fiction',
    lightNovel: 'Light Novel',
    nonFiction: 'Non-Fiction',
    movie: 'Movie',
    tvSeries: 'TV Series',
    game: 'Game',
  };

  constructor(
    private readonly repos: Record<string, MediaRepository<BaseMediaType>>,
  ) {}

  private formatDate(date: unknown): string {
    if (!date) return '';

    // Handle Firestore Timestamp objects
    if (
      typeof date === 'object' &&
      date !== null &&
      'toDate' in date &&
      typeof (date as { toDate: () => Date }).toDate === 'function'
    ) {
      return (date as { toDate: () => Date }).toDate().toISOString();
    }

    // Handle Date objects
    if (date instanceof Date) {
      return date.toISOString();
    }

    // Handle string dates
    if (typeof date === 'string') {
      return new Date(date).toISOString();
    }

    return '';
  }

  private isInTimeRange(
    itemDate: Date | string | undefined,
    startDate?: Date,
    endDate?: Date,
  ): boolean {
    if (!itemDate) return false;
    const date = typeof itemDate === 'string' ? new Date(itemDate) : itemDate;
    if (startDate && date < startDate) return false;
    if (endDate && date > endDate) return false;
    return true;
  }

  private getDateRange(
    timeRange?: string,
    customStart?: string,
    customEnd?: string,
  ): { startDate?: Date; endDate?: Date } {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (timeRange) {
      case 'last7days':
        return {
          startDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
          endDate: now,
        };
      case 'last30days':
        return {
          startDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
          endDate: now,
        };
      case 'last90days':
        return {
          startDate: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000),
          endDate: now,
        };
      case 'thisYear':
        return {
          startDate: new Date(now.getFullYear(), 0, 1),
          endDate: now,
        };
      case 'custom':
        return {
          startDate: customStart ? new Date(customStart) : undefined,
          endDate: customEnd ? new Date(customEnd) : undefined,
        };
      default:
        return {};
    }
  }

  private mapToReportItem(
    item: BaseMediaType & {
      id: string;
      genres?: string[];
      userStats?: { status: string; score?: number };
    },
    mediaType: string,
  ): ReportItem {
    const data = item as MediaWithMetadata;
    return {
      id: item.id,
      mediaType,
      title: item.title,
      genres: item.genres || [],
      score: item.userStats?.score || 0,
      status: item.userStats?.status || 'Unknown',
      imageUrl: item.imageUrl,
      createdAt: this.formatDate(data.createdAt),
      updatedAt: this.formatDate(data.updatedAt),
    };
  }

  private applyFilters(
    items: ReportItem[],
    filters: ReportFilters,
    dateRange: { startDate?: Date; endDate?: Date },
  ): ReportItem[] {
    return items.filter((item) => {
      // Status filter
      if (filters.status && filters.status !== 'All') {
        if (item.status !== filters.status) return false;
      }

      // Time range filter
      if (dateRange.startDate || dateRange.endDate) {
        if (
          !this.isInTimeRange(
            item.createdAt,
            dateRange.startDate,
            dateRange.endDate,
          )
        ) {
          return false;
        }
      }

      // Score filter
      if (filters.minScore !== undefined && item.score < filters.minScore) {
        return false;
      }
      if (filters.maxScore !== undefined && item.score > filters.maxScore) {
        return false;
      }

      // Genres filter
      if (filters.genres && filters.genres.length > 0) {
        const hasMatchingGenre = filters.genres.some((genre) =>
          item.genres.includes(genre),
        );
        if (!hasMatchingGenre) return false;
      }

      return true;
    });
  }

  private sortItems(
    items: ReportItem[],
    sortBy: string,
    sortOrder: 'asc' | 'desc',
  ): ReportItem[] {
    return [...items].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'score':
          comparison = a.score - b.score;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'createdAt':
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          comparison =
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  private calculateSummary(items: ReportItem[]): ReportSummary {
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const byStatus: Record<string, number> = {};
    const byMediaType: Record<string, number> = {};
    let totalScore = 0;
    let scoredItems = 0;
    let recentlyAdded = 0;
    let recentlyUpdated = 0;

    for (const item of items) {
      // Count by status
      byStatus[item.status] = (byStatus[item.status] || 0) + 1;

      // Count by media type
      const label = this.mediaTypeLabels[item.mediaType] || item.mediaType;
      byMediaType[label] = (byMediaType[label] || 0) + 1;

      // Calculate average score
      if (item.score > 0) {
        totalScore += item.score;
        scoredItems++;
      }

      // Count recently added/updated
      const createdAt = new Date(item.createdAt);
      const updatedAt = new Date(item.updatedAt);
      if (createdAt >= last7Days) recentlyAdded++;
      if (updatedAt >= last7Days) recentlyUpdated++;
    }

    return {
      totalItems: items.length,
      byStatus,
      byMediaType,
      averageScore: scoredItems > 0 ? Math.round(totalScore / scoredItems) : 0,
      recentlyAdded,
      recentlyUpdated,
    };
  }

  async getReport(
    userId: string,
    filters: ReportFilters,
    pagination: ReportPagination,
  ): Promise<ReportResponse> {
    const dateRange = this.getDateRange(
      filters.timeRange,
      filters.startDate,
      filters.endDate,
    );

    // Determine which repositories to query
    const reposToQuery: [string, MediaRepository<BaseMediaType>][] =
      filters.mediaType === 'all'
        ? Object.entries(this.repos)
        : Object.entries(this.repos).filter(
            ([key]) => key === filters.mediaType,
          );

    // Fetch all items from selected repositories
    const allItems: ReportItem[] = [];

    await Promise.all(
      reposToQuery.map(async ([mediaType, repo]) => {
        // Fetch all items for the user (no pagination at DB level for filtering)
        const result = await repo.getAll(userId, 1000, undefined, undefined);
        const mappedItems = result.data.map((item) =>
          this.mapToReportItem(
            item as BaseMediaType & { id: string },
            mediaType,
          ),
        );
        allItems.push(...mappedItems);
      }),
    );

    // Apply filters in memory
    const filteredItems = this.applyFilters(allItems, filters, dateRange);

    // Calculate summary before pagination
    const summary = this.calculateSummary(filteredItems);

    // Sort items
    const sortedItems = this.sortItems(
      filteredItems,
      pagination.sortBy,
      pagination.sortOrder,
    );

    // Apply pagination
    const totalItems = sortedItems.length;
    const totalPages = Math.ceil(totalItems / pagination.limit);
    const startIndex = (pagination.page - 1) * pagination.limit;
    const paginatedItems = sortedItems.slice(
      startIndex,
      startIndex + pagination.limit,
    );

    return {
      items: paginatedItems,
      summary,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalItems,
        totalPages,
        hasMore: pagination.page < totalPages,
      },
    };
  }

  async exportReport(
    userId: string,
    filters: ReportFilters,
    format: 'csv' | 'json' = 'csv',
  ): Promise<{ data: string; contentType: string; filename: string }> {
    // Get all items without pagination
    const dateRange = this.getDateRange(
      filters.timeRange,
      filters.startDate,
      filters.endDate,
    );

    const reposToQuery: [string, MediaRepository<BaseMediaType>][] =
      filters.mediaType === 'all'
        ? Object.entries(this.repos)
        : Object.entries(this.repos).filter(
            ([key]) => key === filters.mediaType,
          );

    const allItems: ReportItem[] = [];

    await Promise.all(
      reposToQuery.map(async ([mediaType, repo]) => {
        const result = await repo.getAll(userId, 1000, undefined, undefined);
        const mappedItems = result.data.map((item) =>
          this.mapToReportItem(
            item as BaseMediaType & { id: string },
            mediaType,
          ),
        );
        allItems.push(...mappedItems);
      }),
    );

    const filteredItems = this.applyFilters(allItems, filters, dateRange);
    const sortedItems = this.sortItems(filteredItems, 'createdAt', 'desc');

    const timestamp = new Date().toISOString().split('T')[0];

    if (format === 'json') {
      return {
        data: JSON.stringify(sortedItems, null, 2),
        contentType: 'application/json',
        filename: `media-report-${timestamp}.json`,
      };
    }

    // CSV format
    const headers = [
      'ID',
      'Media Type',
      'Title',
      'Genres',
      'Score',
      'Status',
      'Created At',
      'Updated At',
    ];

    const escapeCSV = (value: string): string => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const formatDateTime = (isoString: string): string => {
      if (!isoString) return '';
      const date = new Date(isoString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    };

    const rows = sortedItems.map((item) => [
      item.id,
      this.mediaTypeLabels[item.mediaType] || item.mediaType,
      escapeCSV(item.title),
      escapeCSV(item.genres.join(', ')),
      String(item.score),
      item.status,
      formatDateTime(item.createdAt),
      formatDateTime(item.updatedAt),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    return {
      data: csvContent,
      contentType: 'text/csv',
      filename: `media-report-${timestamp}.csv`,
    };
  }
}
