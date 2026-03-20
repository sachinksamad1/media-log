import type { Request, Response } from 'express';

import { GlobalSearchService } from '@/common/search/search-service.js';
import { ResponseUtil } from '@/common/utils/api-response.js';

export const globalSearch = async (req: Request, res: Response) => {
  // Extract 'q' for the string and 'type' for the media category
  const { query, type } = req.query;

  if (!query || typeof query !== 'string') {
    return ResponseUtil.error(res, 400, 'Search query is required');
  }

  const searchService = new GlobalSearchService();
  const userId = req.user!.uid;

  try {
    // If a type is provided, we'll tell the service to filter
    // If 'type' is undefined, it performs a global search
    const results = await searchService.search(
      query as string,
      userId,
      type as string,
    );

    return ResponseUtil.send(
      res,
      200,
      results,
      results.length > 0
        ? `Found ${results.length} results for "${query}"${type ? ` in ${type}` : ''}`
        : 'No results found',
    );
  } catch {
    return ResponseUtil.error(res, 500, 'An error occurred during search');
  }
};

export const globalRandom = async (req: Request, res: Response) => {
  const { type } = req.query;
  const searchService = new GlobalSearchService();
  const userId = req.user!.uid;

  try {
    const result = await searchService.getRandom(userId, type as string);

    if (!result) {
      return ResponseUtil.send(
        res,
        200,
        null, // explicitly null if no result
        'No items found to pick from',
      );
    }

    return ResponseUtil.send(res, 200, result, 'Random item fetched');
  } catch (error) {
    console.error('Error fetching random pick:', error);
    return ResponseUtil.error(
      res,
      500,
      'An error occurred fetching random item',
    );
  }
};
