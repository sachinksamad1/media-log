import { ResponseUtil } from '@common/utils/api-response.js';
import { catchAsync } from '@common/utils/catch-async.js';
import type { Request, Response } from 'express';

import type { StatsService } from './stats-service.js';

export class StatsController {
  constructor(private statsService: StatsService) {}

  /**
   * GET /api/stats/summary
   * Returns comprehensive statistics for the user's library
   */
  getSummary = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      return ResponseUtil.error(res, 401, 'Unauthorized: User context missing');
    }

    const userId = req.user.uid;
    const summary = await this.statsService.getStatsSummary(userId);

    ResponseUtil.send(res, 200, summary, 'Statistics fetched successfully');
  });
}
