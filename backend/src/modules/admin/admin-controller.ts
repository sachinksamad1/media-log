import type { Request, Response, NextFunction } from 'express';

import { AdminService } from '@/modules/admin/admin-service.js';

export class AdminController {
  private readonly adminService = new AdminService();

  /**
   * Triggers the full system cleanup
   */
  runCleanup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const results = await this.adminService.runFullSystemCleanup();

      res.status(200).json({
        success: true,
        message: 'Full system cleanup completed successfully',
        data: results,
      });
    } catch (error) {
      next(error);
    }
  };
}
