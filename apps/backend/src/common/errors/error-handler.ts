import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

import { AppError } from '@/common/errors/app-error.js';
import { ResponseUtil } from '@/common/utils/api-response.js';

interface BodyParserError extends SyntaxError {
  status: number;
  type: string;
  body: unknown;
}

export const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  try {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let stack: string | undefined;

    // Domain errors (your own)
    if (err instanceof AppError) {
      statusCode = err.statusCode;
      message = err.message;
    }

    // Zod validation errors
    else if (isZodError(err)) {
      statusCode = 400;
      message = 'Validation Failed';
    }

    // Handle BodyParser JSON Syntax Error
    else if (
      (err instanceof SyntaxError &&
        ((err as BodyParserError).status === 400 ||
          (err as BodyParserError).type === 'entity.parse.failed') &&
        'body' in err) ||
      (err instanceof SyntaxError && err.message.includes('JSON'))
    ) {
      statusCode = 400;
      message = 'Invalid JSON payload';
    }

    // Fallback for native JS errors
    else if (err instanceof Error) {
      // eslint-disable-next-line no-console
      console.error('GlobalErrorHandler: Unhandled Error:', err);
      message = err.message;
    }

    if (process.env.NODE_ENV === 'development' && err instanceof Error) {
      stack = err.stack;
      // eslint-disable-next-line no-console
      console.error(err);
    }

    ResponseUtil.error(res, statusCode, message, stack);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('GlobalErrorHandler failed:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Application Error',
      data: null,
    });
  }
};

const isZodError = (err: unknown): err is ZodError => {
  return err instanceof ZodError;
};
