import type { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import { ZodError } from 'zod';

import { AppError } from '../errors/app-error.js';
import { ResponseUtil } from '../utils/api-response.js';

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

  // Multer file size error
  else if (isMulterLimitError(err)) {
    statusCode = 413;
    message = 'File too large. Max limit is 5MB.';
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

const isMulterLimitError = (err: unknown): err is MulterError => {
  return err instanceof MulterError && err.code === 'LIMIT_FILE_SIZE';
};
