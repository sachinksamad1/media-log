import type { Response } from 'express';

export abstract class MediaController {
  protected sendSuccess<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    meta?: Record<string, unknown>,
  ) {
    res.status(200).json({
      success: true,
      message,
      data,
      meta,
    });
  }

  protected sendCreated<T>(
    res: Response,
    data: T,
    message: string = 'Created successfully',
  ) {
    res.status(201).json({
      success: true,
      message,
      data,
    });
  }
}
