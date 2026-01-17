import { MediaController } from '@common/media/media-controller.js';
import { ResponseUtil } from '@common/utils/api-response.js';
import { catchAsync } from '@common/utils/catch-async.js';
import { NonFictionMapper } from '@modules/media/non-fiction/non-fiction-mapper.js';
import { NonFictionService } from '@modules/media/non-fiction/non-fiction-service.js';
import type { Request, Response } from 'express';

export class NonFictionController extends MediaController {
  private service = new NonFictionService();
  private mapper = new NonFictionMapper();

  create = catchAsync(async (req: Request, res: Response) => {
    // 1. Multer puts the file here
    const file = req.file;
    const userId = req.user!.uid;

    // 2. req.body contains text fields. If sending a JSON string in one field, parse it.
    // Otherwise, use req.body directly.
    const data =
      typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body;

    const result = await this.service.create(data, userId, file);
    this.sendCreated(res, this.mapper.toDto(result), 'Non-fiction added with image');
  });

  update = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user!.uid;
    const file = req.file; // New image file if provided

    const data =
      typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body;

    const result = await this.service.update(id, data, userId, file);
    this.sendSuccess(res, this.mapper.toDto(result), 'Non-fiction updated');
  });

  // Get all anime
  getAll = catchAsync(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 20;
    const cursor = req.query.cursor as string;
    const status = req.query.status as string;
    const userId = req.user!.uid;

    const result = await this.service.getAll(userId, limit, cursor, status);
    const mappedData = this.mapper.toDtoList(result.data);

    // Using the utility for a consistent JSON structure
    ResponseUtil.send(res, 200, mappedData, 'Non-fiction library fetched', {
      nextCursor: result.nextCursor,
      count: mappedData.length,
    });
  });

  // Get anime by id
  getById = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.uid;
    const result = await this.service.getById(req.params.id as string, userId);
    this.sendSuccess(res, this.mapper.toDto(result), 'Non-fiction fetched');
  });

  // Mark as Completed
  complete = catchAsync(async (req: Request, res: Response) => {
    const score =
      req.body.score !== undefined ? Number(req.body.score) : undefined;
    const userId = req.user!.uid;

    const result = await this.service.completeSeries(
      req.params.id as string,
      userId,
      score,
    );
    this.sendSuccess(
      res,
      this.mapper.toDto(result),
      'Non-fiction marked as complete',
    );
  });

  // Delete non-fiction
  delete = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user!.uid;

    await this.service.delete(id, userId);

    // Return a consistent success message
    this.sendSuccess(res, null, `Entry with ID ${id} deleted successfully`);
  });
}
