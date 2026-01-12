import type { Request, Response } from 'express';

import { MediaController } from '../../../common/media/media-controller.js';
import { catchAsync } from '../../../common/utils/catch-async.js';

import { MovieMapper } from './movie-mapper.js';
import { MovieService } from './movie-service.js';

export class MovieController extends MediaController {
  private service = new MovieService();
  private mapper = new MovieMapper();

  // Create Fiction Entry
  create = catchAsync(async (req: Request, res: Response) => {
    const result = await this.service.create(req.body);
    this.sendCreated(res, this.mapper.toDto(result), 'Movie added to library');
  });

  // Get all Movies
  getAll = catchAsync(async (req: Request, res: Response) => {
    const { limit, lastDocId } = req.query;
    const result = await this.service.getAll(
      Number(limit) || 10,
      lastDocId as string,
    );

    // Map each item in the data array to its DTO version
    const mappedData = this.mapper.toDtoList(result.data);

    this.sendSuccess(res, mappedData, 'Library fetched', {
      nextCursor: result.nextCursor,
    });
  });

  // Get Movie by id
  getById = catchAsync(async (req: Request, res: Response) => {
    const result = await this.service.getById(req.params.id as string);
    this.sendSuccess(res, this.mapper.toDto(result), 'Movie fetched');
  });

  // Mark as Completed
  complete = catchAsync(async (req: Request, res: Response) => {
    const score =
      req.body.score !== undefined ? Number(req.body.score) : undefined;
    const result = await this.service.complete(req.params.id as string, score);
    this.sendSuccess(
      res,
      this.mapper.toDto(result),
      'Movie marked as complete',
    );
  });

  // Delete Movie Entry
  delete = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await this.service.delete(id);

    // Return a consistent success message
    this.sendSuccess(res, null, `Entry with ID ${id} deleted successfully`);
  });

  // Update Movie
  update = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await this.service.update(id, req.body);
    this.sendSuccess(res, this.mapper.toDto(result), 'Movie updated');
  });
}
