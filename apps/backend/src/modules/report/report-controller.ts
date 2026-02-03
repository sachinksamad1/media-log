import { ResponseUtil } from '@common/utils/api-response.js';
import { catchAsync } from '@common/utils/catch-async.js';
import type { Request, Response } from 'express';

import type { ReportService } from './report-service.js';
import type {
  ReportFilters,
  ReportPagination,
  ReportMediaType,
  ReportSortField,
  ReportSortOrder,
} from './report-types.js';

export class ReportController {
  constructor(private reportService: ReportService) {}

  /**
   * GET /api/reports
   * Returns paginated report data with filters
   */
  getReport = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      return ResponseUtil.error(res, 401, 'Unauthorized: User context missing');
    }

    const userId = req.user.uid;

    // Parse query parameters
    const filters: ReportFilters = {
      mediaType: (req.query.mediaType as ReportMediaType) || 'all',
      status: req.query.status as string | undefined,
      timeRange: req.query.timeRange as string | undefined,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      minScore: req.query.minScore
        ? parseInt(req.query.minScore as string, 10)
        : undefined,
      maxScore: req.query.maxScore
        ? parseInt(req.query.maxScore as string, 10)
        : undefined,
      genres: req.query.genres
        ? (req.query.genres as string).split(',')
        : undefined,
    };

    const pagination: ReportPagination = {
      page: parseInt(req.query.page as string, 10) || 1,
      limit: Math.min(parseInt(req.query.limit as string, 10) || 20, 100),
      sortBy: (req.query.sortBy as ReportSortField) || 'createdAt',
      sortOrder: (req.query.sortOrder as ReportSortOrder) || 'desc',
    };

    const report = await this.reportService.getReport(
      userId,
      filters,
      pagination,
    );

    ResponseUtil.send(res, 200, report, 'Report generated successfully');
  });

  /**
   * GET /api/reports/export
   * Exports report data as CSV or JSON
   */
  exportReport = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      return ResponseUtil.error(res, 401, 'Unauthorized: User context missing');
    }

    const userId = req.user.uid;

    const filters: ReportFilters = {
      mediaType: (req.query.mediaType as ReportMediaType) || 'all',
      status: req.query.status as string | undefined,
      timeRange: req.query.timeRange as string | undefined,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      minScore: req.query.minScore
        ? parseInt(req.query.minScore as string, 10)
        : undefined,
      maxScore: req.query.maxScore
        ? parseInt(req.query.maxScore as string, 10)
        : undefined,
      genres: req.query.genres
        ? (req.query.genres as string).split(',')
        : undefined,
    };

    const format = (req.query.format as 'csv' | 'json') || 'csv';

    const exportData = await this.reportService.exportReport(
      userId,
      filters,
      format,
    );

    res.setHeader('Content-Type', exportData.contentType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${exportData.filename}"`,
    );
    res.send(exportData.data);
  });

  /**
   * GET /api/reports/summary
   * Returns quick summary statistics for the report page
   */
  getSummary = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      return ResponseUtil.error(res, 401, 'Unauthorized: User context missing');
    }

    const userId = req.user.uid;

    const filters: ReportFilters = {
      mediaType: 'all',
    };

    const pagination: ReportPagination = {
      page: 1,
      limit: 1000,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };

    const report = await this.reportService.getReport(
      userId,
      filters,
      pagination,
    );

    ResponseUtil.send(res, 200, report.summary, 'Summary fetched successfully');
  });
}
