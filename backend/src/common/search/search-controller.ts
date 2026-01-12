import type { Request, Response } from 'express';

import { ResponseUtil } from '../utils/api-response.js';

import { GlobalSearchService } from './search-service.js';

export const globalSearch = async (req: Request, res: Response) => {
  // Extract 'q' for the string and 'type' for the media category
  const { query, type } = req.query;

  if (!query || typeof query !== 'string') {
    return ResponseUtil.error(res, 400, 'Search query is required');
  }

  const searchService = new GlobalSearchService();

  try {
    // If a type is provided, we'll tell the service to filter
    // If 'type' is undefined, it performs a global search
    const results = await searchService.search(query as string, type as string);

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