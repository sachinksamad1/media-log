import { getPaginationParams } from '@common/utils/pagination.js';
import type { Request } from 'express';
import { describe, expect, it } from 'vitest';

describe('getPaginationParams', () => {
  it('should return default limit when no query params provided', () => {
    const req = { query: {} } as unknown as Request;
    const params = getPaginationParams(req);

    expect(params).toEqual({
      limit: 10,
      lastDocId: undefined,
    });
  });

  it('should parse limit from query', () => {
    const req = { query: { limit: '20' } } as unknown as Request;
    const params = getPaginationParams(req);

    expect(params.limit).toBe(20);
  });

  it('should return lastDocId when provided', () => {
    const req = { query: { lastDocId: 'abc-123' } } as unknown as Request;
    const params = getPaginationParams(req);

    expect(params.lastDocId).toBe('abc-123');
  });

  it('should handle limit and lastDocId together', () => {
    const req = {
      query: { limit: '50', lastDocId: 'xyz-789' },
    } as unknown as Request;

    const params = getPaginationParams(req);

    expect(params).toEqual({
      limit: 50,
      lastDocId: 'xyz-789',
    });
  });
});
