import type { Response } from 'express';

/**
 * Standard Meta structure for Pagination & Dashboarding
 */
export interface ResponseMeta {
  totalItems?: number;
  nextCursor?: string | null;
  count?: number;
}

/**
 * Unified Response Interface
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: ResponseMeta;
  error?: string; // Optional field for error details in dev
}

export class ResponseUtil {
  /**
   * Success Response Helper
   */
  static send<T>(
    res: Response,
    statusCode: number,
    data: T,
    message: string = 'Request successful',
    meta?: ResponseMeta,
  ): void {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      meta,
    };
    res.status(statusCode).json(response);
  }

  /**
   * Standardized Error Response (Used by Error Handler)
   */
  static error(
    res: Response,
    statusCode: number,
    message: string,
    error?: string,
  ): void {
    const response: ApiResponse<null> = {
      success: false,
      message,
      data: null,
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    };
    res.status(statusCode).json(response);
  }
}
