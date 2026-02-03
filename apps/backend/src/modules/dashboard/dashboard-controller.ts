import type { DashboardService } from '@modules/dashboard/dashboard-service.js';
import type { Request, Response, NextFunction } from 'express';

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
