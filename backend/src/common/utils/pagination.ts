export interface PaginationParams {
  limit: number;
  lastDocId?: string; // The cursor for the next page
}

export const getPaginationParams = (req: any): PaginationParams => {
  return {
    limit: parseInt(req.query.limit as string) || 10,
    lastDocId: req.query.lastDocId as string | undefined
  };
};