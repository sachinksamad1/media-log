import type { Request, Response } from 'express';

import { MediaController } from '../../../common/media/media-controller.js';
import { catchAsync } from '../../../common/utils/catch-async.js';

import { GamesMapper } from './game-mapper.js';
import { GamesService } from './game-service.js';

export class GamesController extends MediaController {
  private service = new GamesService();
  private mapper = new GamesMapper();

  // Create Fiction Entry
  create = catchAsync(async (req: Request, res: Response) => {
    const result = await this.service.create(req.body);
    this.sendCreated(res, this.mapper.toDto(result), 'Game added to library');
  });

  // Get all Fiction
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

  // Get Games by id
  getById = catchAsync(async (req: Request, res: Response) => {
    const result = await this.service.getById(req.params.id as string);
    this.sendSuccess(res, this.mapper.toDto(result), 'Game fetched');
  });

  // Mark as Completed
  complete = catchAsync(async (req: Request, res: Response) => {
    const score =
      req.body.score !== undefined ? Number(req.body.score) : undefined;
    const result = await this.service.completeGame(
      req.params.id as string,
      score,
    );
    this.sendSuccess(res, this.mapper.toDto(result), 'Game marked as complete');
  });

  // Delete Game Entry
  delete = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await this.service.delete(id);

    // Return a consistent success message
    this.sendSuccess(res, null, `Entry with ID ${id} deleted successfully`);
  });

  // Update Game
  update = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await this.service.update(id, req.body);
    this.sendSuccess(res, this.mapper.toDto(result), 'Game updated');
  });
}
