import { Request, Response } from "express";
import { BaseController } from "../../common/base/base-controller.js";
import { AnimeService } from "./anime-service.js";
import { catchAsync } from "../../common/utils/catch-async.js";

export class AnimeController extends BaseController {
  private service = new AnimeService();

  // We use arrow functions to bind 'this' correctly
  create = catchAsync(async (req: Request, res: Response) => {
    const result = await this.service.create(req.body);
    this.sendCreated(res, result, "Anime added to library");
  });

  getAll = catchAsync(async (req: Request, res: Response) => {
    const { limit, lastDocId } = req.query;
    const result = await this.service.getAll(
      Number(limit) || 10,
      lastDocId as string
    );
    this.sendSuccess(res, result.data, "Library fetched", {
      nextCursor: result.nextCursor,
    });
  });

  // Custom action
  complete = catchAsync(async (req: Request, res: Response) => {
    const result = await this.service.completeSeries(req.params.id as string);
    this.sendSuccess(res, result, "Series marked as complete");
  });
}
