import type { BaseMediaType } from '@common/media/media-types.js';

export type ReportMediaType =
  | 'anime'
  | 'manga'
  | 'fiction'
  | 'lightNovel'
  | 'nonFiction'
  | 'movie'
  | 'tvSeries'
  | 'game'
  | 'all';

export type ReportTimeRange =
  | 'all'
  | 'last7days'
  | 'last30days'
  | 'last90days'
  | 'thisYear'
  | 'custom';

export type ReportSortField =
  | 'title'
  | 'score'
  | 'status'
  | 'createdAt'
  | 'updatedAt';

export type ReportSortOrder = 'asc' | 'desc';

export interface ReportFilters {
  mediaType: ReportMediaType;
  status?: string;
  timeRange?: string;
  startDate?: string;
  endDate?: string;
  minScore?: number;
  maxScore?: number;
  genres?: string[];
}

export interface ReportPagination {
  page: number;
  limit: number;
  sortBy: ReportSortField;
  sortOrder: ReportSortOrder;
}

export interface ReportItem {
  id: string;
  mediaType: string;
  title: string;
  genres: string[];
  score: number;
  status: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportSummary {
  totalItems: number;
  byStatus: Record<string, number>;
  byMediaType: Record<string, number>;
  averageScore: number;
  recentlyAdded: number;
  recentlyUpdated: number;
}

export interface ReportResponse {
  items: ReportItem[];
  summary: ReportSummary;
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface ExportOptions {
  format: 'csv' | 'json';
  includeAllFields: boolean;
  dateFormat?: string;
}

export interface MediaWithMetadata extends BaseMediaType {
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
