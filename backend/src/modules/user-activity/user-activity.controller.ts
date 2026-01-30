import { ResponseUtil } from '@common/utils/api-response.js';
import { catchAsync } from '@common/utils/catch-async.js';
import type { Request, Response } from 'express';

import { userActivityService } from './user-activity.service.js';

export class UserActivityController {
  getRecent = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      return ResponseUtil.error(res, 401, 'Unauthorized: User context missing');
    }

    const userId = req.user.uid;
    const limit = parseInt(req.query.limit as string) || 20;

    const activities = await userActivityService.getRecentActivities(
      userId,
      limit,
    );

    ResponseUtil.send(res, 200, activities, 'Recent activities fetched');
  });
}
