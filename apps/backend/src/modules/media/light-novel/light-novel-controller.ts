import { MediaController } from '@common/media/media-controller.js';
import { ResponseUtil } from '@common/utils/api-response.js';
import { catchAsync } from '@common/utils/catch-async.js';
import { LightNovelMapper } from '@modules/media/light-novel/light-novel-mapper.js';
import { LightNovelService } from '@modules/media/light-novel/light-novel-service.js';
import type { Request, Response } from 'express';

export class LightNovelController extends MediaController {
  private service = new LightNovelService();
  private mapper = new LightNovelMapper();

  // Create light novel
  create = catchAsync(async (req: Request, res: Response) => {
    const file = req.file;
    const userId = req.user!.uid;

    const data =
      typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body;

    const result = await this.service.create(data, userId, file);
    this.sendCreated(
      res,
      this.mapper.toDto(result),
      'Light Novel added with image',
    );
  });

  // Update light novel
  update = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user!.uid;
    const file = req.file;

    const data =
      typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body;

    const result = await this.service.update(id, data, userId, file);
    this.sendSuccess(res, this.mapper.toDto(result), 'Light Novel updated');
  });

  // Get all light novels
  getAll = catchAsync(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 20;
    const cursor = req.query.cursor as string;
    const status = req.query.status as string;
    const userId = req.user!.uid;

    const result = await this.service.getAll(userId, limit, cursor, status);
    const mappedData = this.mapper.toDtoList(result.data);

    ResponseUtil.send(res, 200, mappedData, 'Light Novel library fetched', {
      nextCursor: result.nextCursor,
      count: mappedData.length,
    });
  });

  // Get light novel by id
  getById = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.uid;
    const result = await this.service.getById(req.params.id as string, userId);
    this.sendSuccess(res, this.mapper.toDto(result), 'Light Novel fetched');
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
      'Light Novel marked as complete',
    );
  });

  // Delete light novel
  delete = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user!.uid;

    await this.service.delete(id, userId);

    this.sendSuccess(res, null, `Entry with ID ${id} deleted successfully`);
  });
}
