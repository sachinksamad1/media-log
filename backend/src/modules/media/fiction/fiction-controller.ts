import { Request, Response } from "express";
import { MediaController } from "../../../common/media/media-controller.js";
import { FictionService } from "./fiction-service.js";
import { catchAsync } from "../../../common/utils/catch-async.js";
import { FictionMapper } from "./fiction-mapper.js";

export class FictionController extends MediaController {
  private service = new FictionService();
  private mapper = new FictionMapper();

  // Create Fiction Entry
  create = catchAsync(async (req: Request, res: Response) => {
    const result = await this.service.create(req.body);
    this.sendCreated(
      res,
      this.mapper.toDto(result),
      "Fiction added to library"
    );
  });

  // Get all Fiction
  getAll = catchAsync(async (req: Request, res: Response) => {
    const { limit, lastDocId } = req.query;
    const result = await this.service.getAll(
      Number(limit) || 10,
      lastDocId as string
    );

    // Map each item in the data array to its DTO version
    const mappedData = this.mapper.toDtoList(result.data);

    this.sendSuccess(res, mappedData, "Fiction Library fetched", {
      nextCursor: result.nextCursor,
    });
  });

  // Get Fiction by id
  getById = catchAsync(async (req: Request, res: Response) => {
    const result = await this.service.getById(req.params.id as string);
    this.sendSuccess(res, this.mapper.toDto(result), "Fiction fetched");
  });

  // Mark as Completed
  complete = catchAsync(async (req: Request, res: Response) => {
    const score =
      req.body.score !== undefined ? Number(req.body.score) : undefined;
    const result = await this.service.completeSeries(
      req.params.id as string,
      score
    );
    this.sendSuccess(
      res,
      this.mapper.toDto(result),
      "Fiction marked as complete"
    );
  });

  // Delete Fiction Entry
  delete = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await this.service.delete(id);

    // Return a consistent success message
    this.sendSuccess(res, null, `Entry with ID ${id} deleted successfully`);
  });

  // Update Fiction
  update = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await this.service.update(id, req.body);
    this.sendSuccess(res, this.mapper.toDto(result), "Fiction updated");
  });
}
