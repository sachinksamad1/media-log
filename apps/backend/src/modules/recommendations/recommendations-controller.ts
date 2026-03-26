import { ResponseUtil } from '@common/utils/api-response.js';
import { catchAsync } from '@common/utils/catch-async.js';
import type { Request, Response } from 'express';

import { RecommendationsService } from './recommendations-service.js';

export class RecommendationsController {
  private service = new RecommendationsService();

  getRecommendations = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.uid;
    const limit = parseInt(req.query.limit as string) || 10;

    const recommendations = await this.service.getRecommendations(
      userId,
      limit,
    );

    ResponseUtil.send(
      res,
      200,
      recommendations,
      'Recommendations fetched successfully',
      { count: recommendations.length },
    );
  });
}
