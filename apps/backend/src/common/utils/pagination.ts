import type { Request } from 'express';

export interface PaginationParams {
  limit: number;
  lastDocId?: string;
}

export const getPaginationParams = (req: Request): PaginationParams => {
  return {
    limit: parseInt(req.query.limit as string) || 10,
    lastDocId: req.query.lastDocId as string | undefined,
  };
};
