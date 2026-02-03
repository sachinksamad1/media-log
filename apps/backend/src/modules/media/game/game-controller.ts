import { MediaController } from '@common/media/media-controller.js';
import { ResponseUtil } from '@common/utils/api-response.js';
import { catchAsync } from '@common/utils/catch-async.js';
import { GameMapper } from '@modules/media/game/game-mapper.js';
import { GameService } from '@modules/media/game/game-service.js';
import type { Request, Response } from 'express';

export class GameController extends MediaController {
  private service = new GameService();
  private mapper = new GameMapper();

  // Create game
  create = catchAsync(async (req: Request, res: Response) => {
    const file = req.file;
    const userId = req.user!.uid;
    const data =
      typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body;
    const result = await this.service.create(data, userId, file);
    this.sendCreated(res, this.mapper.toDto(result), 'Game added with image');
  });

  // Update game
  update = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user!.uid;
    const file = req.file;
    const data =
      typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body;

    const result = await this.service.update(id, data, userId, file);
    this.sendSuccess(res, this.mapper.toDto(result), 'Game updated');
  });

  // Get all games
  getAll = catchAsync(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 20;
    const cursor = req.query.cursor as string;
    const status = req.query.status as string;
    const userId = req.user!.uid;
    const result = await this.service.getAll(userId, limit, cursor, status);
    const mappedData = this.mapper.toDtoList(result.data);
    ResponseUtil.send(res, 200, mappedData, 'Game library fetched', {
      nextCursor: result.nextCursor,
      count: mappedData.length,
    });
  });

  // Get game by id
  getById = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.uid;
    const result = await this.service.getById(req.params.id as string, userId);
    this.sendSuccess(res, this.mapper.toDto(result), 'Game fetched');
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
    this.sendSuccess(res, this.mapper.toDto(result), 'Game marked as complete');
  });

  // Delete game
  delete = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user!.uid;

    await this.service.delete(id, userId);

    // Return a consistent success message
    this.sendSuccess(res, null, `Entry with ID ${id} deleted successfully`);
  });
}
