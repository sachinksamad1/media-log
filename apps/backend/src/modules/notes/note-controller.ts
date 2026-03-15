import { ResponseUtil } from '@common/utils/api-response.js';
import { catchAsync } from '@common/utils/catch-async.js';
import type { Request, Response } from 'express';

import { NoteService } from './note-service.js';

export class NoteController {
  private service = new NoteService();

  create = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.uid;
    const note = await this.service.create(userId, req.body);
    ResponseUtil.send(res, 201, note, 'Note created');
  });

  getByMediaId = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.uid;
    const mediaId = req.params.mediaId as string;
    const notes = await this.service.getByMediaId(userId, mediaId);
    ResponseUtil.send(res, 200, notes, 'Notes fetched');
  });

  update = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.uid;
    const id = req.params.id as string;
    const note = await this.service.update(userId, id, req.body);
    ResponseUtil.send(res, 200, note, 'Note updated');
  });

  delete = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.uid;
    const id = req.params.id as string;
    await this.service.delete(userId, id);
    ResponseUtil.send(res, 200, null, 'Note deleted');
  });
}
