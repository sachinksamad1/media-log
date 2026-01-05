import { Request, Response } from "express";
import { BaseController } from "../../common/base/base-controller.js";
import { MangaService } from "./manga-service.js";
import { catchAsync } from "../../common/utils/catch-async.js";
import { MangaMapper } from "./manga-mapper.js";

export class MangaController extends BaseController {
  private service = new MangaService();
  private mapper = new MangaMapper();

  // Create Fiction Entry
  create = catchAsync(async (req: Request, res: Response) => {
    const result = await this.service.create(req.body);
    this.sendCreated(
      res,
      this.mapper.toDto(result),
      "Light Novel added to library"
    );
  });

  // Get all Light Novels
  getAll = catchAsync(async (req: Request, res: Response) => {
    const { limit, lastDocId } = req.query;
    const result = await this.service.getAll(
      Number(limit) || 10,
      lastDocId as string
    );

    // Map each item in the data array to its DTO version
    const mappedData = this.mapper.toDtoList(result.data);

    this.sendSuccess(res, mappedData, "Library fetched", {
      nextCursor: result.nextCursor,
    });
  });

  // Get Light Novel by id
  getById = catchAsync(async (req: Request, res: Response) => {
    const result = await this.service.getById(req.params.id as string);
    this.sendSuccess(res, this.mapper.toDto(result), "Light Novel fetched");
  });

  // Mark as Completed
  complete = catchAsync(async (req: Request, res: Response) => {
    const score =
      req.body.score !== undefined ? Number(req.body.score) : undefined;
    const result = await this.service.complete(
      req.params.id as string,
      score
    );
    this.sendSuccess(
      res,
      this.mapper.toDto(result),
      "Light Novel marked as complete"
    );
  });

  // Delete Light Novel Entry
  delete = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await this.service.delete(id);

    // Return a consistent success message
    this.sendSuccess(res, null, `Entry with ID ${id} deleted successfully`);
  });

  // Update Light Novel
  update = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await this.service.update(id, req.body);
    this.sendSuccess(res, this.mapper.toDto(result), "Light Novel updated");
  });
}
