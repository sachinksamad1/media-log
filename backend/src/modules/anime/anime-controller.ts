import { Request, Response } from "express";
import { BaseController } from "../../common/base/base-controller.js";
import { AnimeService } from "./anime-service.js";
import { catchAsync } from "../../common/utils/catch-async.js";
import { Mapper } from "../../common/utils/mapper.js";

export class AnimeController extends BaseController {
  private service = new AnimeService();

  // Create anime
  create = catchAsync(async (req: Request, res: Response) => {
    const result = await this.service.create(req.body);
    this.sendCreated(res, result, "Anime added to library");
  });

  // Get all anime
  getAll = catchAsync(async (req: Request, res: Response) => {
    const { limit, lastDocId } = req.query;
    const result = await this.service.getAll(
      Number(limit) || 10,
      lastDocId as string
    );

    // Map each item in the data array to its DTO version
    const mappedData = result.data.map((item) => Mapper.toAnimeDTO(item));

    this.sendSuccess(res, mappedData, "Library fetched", {
      nextCursor: result.nextCursor,
    });
  });

  // Get anime by id
  getById = catchAsync(async (req: Request, res: Response) => {
    const result = await this.service.getById(req.params.id as string);
    this.sendSuccess(res, result, "Anime fetched");
  });

  // Mark as Completed
  complete = catchAsync(async (req: Request, res: Response) => {
    const result = await this.service.completeSeries(req.params.id as string);
    this.sendSuccess(res, result, "Series marked as complete");
  });

  // Delete anime
  delete = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await this.service.delete(id);

    // Return a consistent success message
    this.sendSuccess(res, null, `Entry with ID ${id} deleted successfully`);
  });

  // Update anime
  update = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await this.service.update(id, req.body);
    this.sendSuccess(res, result, "Anime updated");
  });
}
