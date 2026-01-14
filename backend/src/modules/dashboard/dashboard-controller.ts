import type { Request, Response, NextFunction } from 'express';

import type { DashboardService } from './dashboard-service.js';

export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  /**
   * GET /api/dashboard/library-summary
   */
  getLibrarySummary = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.uid;
      const summary = await this.dashboardService.getLibrarySummary(userId);

      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  };
}
