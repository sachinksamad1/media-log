import { Response } from "express";

export abstract class BaseController {
  protected sendSuccess<T>(res: Response, data: T, message: string = "Success", meta?: any) {
    res.status(200).json({
      success: true,
      message,
      data,
      meta
    });
  }

  protected sendCreated<T>(res: Response, data: T, message: string = "Created successfully") {
    res.status(201).json({
      success: true,
      message,
      data
    });
  }
}