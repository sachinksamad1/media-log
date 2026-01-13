import type { Request, Response } from 'express';

import { MediaController } from '../../../common/media/media-controller.js';
import { ResponseUtil } from '../../../common/utils/api-response.js';
import { catchAsync } from '../../../common/utils/catch-async.js';

import { AnimeMapper } from './anime-mapper.js';
import { AnimeService } from './anime-service.js';

export class AnimeController extends MediaController {
  private service = new AnimeService();
  private mapper = new AnimeMapper();

  create = catchAsync(async (req: Request, res: Response) => {
    // 1. Multer puts the file here
    const file = req.file;

    // 2. req.body contains text fields. If sending a JSON string in one field, parse it.
    // Otherwise, use req.body directly.
    const data =
      typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body;

    const result = await this.service.create(data, file);
    this.sendCreated(res, this.mapper.toDto(result), 'Anime added with image');
  });

  update = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const file = req.file; // New image file if provided

    const data =
      typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body;

    const result = await this.service.update(id, data, file);
    this.sendSuccess(res, this.mapper.toDto(result), 'Anime updated');
  });

  // Get all anime
  getAll = catchAsync(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 20;
    const cursor = req.query.cursor as string;
    const status = req.query.status as string;
    const result = await this.service.getAll(limit, cursor, status);
    const mappedData = this.mapper.toDtoList(result.data);

    // Using the utility for a consistent JSON structure
    ResponseUtil.send(res, 200, mappedData, 'Anime library fetched', {
      nextCursor: result.nextCursor,
      count: mappedData.length,
    });
  });

  // Get anime by id
  getById = catchAsync(async (req: Request, res: Response) => {
    const result = await this.service.getById(req.params.id as string);
    this.sendSuccess(res, this.mapper.toDto(result), 'Anime fetched');
  });

  // Mark as Completed
  complete = catchAsync(async (req: Request, res: Response) => {
    const score =
      req.body.score !== undefined ? Number(req.body.score) : undefined;
    const result = await this.service.completeSeries(
      req.params.id as string,
      score,
    );
    this.sendSuccess(
      res,
      this.mapper.toDto(result),
      'Series marked as complete',
    );
  });

  // Delete anime
  delete = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await this.service.delete(id);

    // Return a consistent success message
    this.sendSuccess(res, null, `Entry with ID ${id} deleted successfully`);
  });
}
