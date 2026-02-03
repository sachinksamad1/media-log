import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

import { AppError } from '@/common/errors/app-error.js';
import { ResponseUtil } from '@/common/utils/api-response.js';

export const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
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

  // Fallback for native JS errors
  else if (err instanceof Error) {
    message = err.message;
  }

  if (process.env.NODE_ENV === 'development' && err instanceof Error) {
    stack = err.stack;
    // eslint-disable-next-line no-console
    console.error(err);
  }

  ResponseUtil.error(res, statusCode, message, stack);
};

const isZodError = (err: unknown): err is ZodError => {
  return err instanceof ZodError;
};
