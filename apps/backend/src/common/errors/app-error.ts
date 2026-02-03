export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.name = 'AppError'; // Critical for identification
    this.statusCode = statusCode;
    this.isOperational = true;

    // V8-safe stack trace capture
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
