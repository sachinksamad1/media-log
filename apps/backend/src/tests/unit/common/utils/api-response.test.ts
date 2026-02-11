import { ResponseUtil } from '@common/utils/api-response.js';
import type { Response } from 'express';
import { describe, expect, it, vi } from 'vitest';

describe('ResponseUtil', () => {
  const mockResponse = () => {
    const res = {} as Response;
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
  };

  describe('send', () => {
    it('should send a success response with correct structure', () => {
      const res = mockResponse();
      const data = { id: 1, name: 'test' };
      const message = 'Success';
      const statusCode = 200;

      ResponseUtil.send(res, statusCode, data, message);

      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message,
        data,
        meta: undefined,
      });
    });

    it('should include meta when provided', () => {
      const res = mockResponse();
      const meta = { totalItems: 10, count: 1 };

      ResponseUtil.send(res, 200, [], 'Success', meta);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          meta,
        }),
      );
    });
  });

  describe('error', () => {
    it('should send an error response with correct structure', () => {
      const res = mockResponse();
      const message = 'Error occurred';
      const statusCode = 400;

      ResponseUtil.error(res, statusCode, message);

      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message,
        data: null,
        error: undefined, // NODE_ENV might be test, check implementation
      });
    });

    it('should include error details in development mode', () => {
      process.env.NODE_ENV = 'development';
      const res = mockResponse();
      const errorDetail = 'Stack trace...';

      ResponseUtil.error(res, 500, 'Server Error', errorDetail);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: errorDetail,
        }),
      );

      process.env.NODE_ENV = 'test'; // Reset
    });
  });
});
