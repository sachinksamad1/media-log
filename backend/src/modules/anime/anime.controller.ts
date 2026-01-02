import { Request, Response } from "express";
import { catchAsync } from "../../common/utils/catch-async.js";
import { AnimeService } from "./anime.service.js";

const service = new AnimeService();

export const createAnime = catchAsync(async (req: Request, res: Response) => {
  const result = await service.addNewAnime(req.body);
  res.status(201).json({ success: true, data: result });
});

export const updateAnimeProgress = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await service.updateAnimeProgress(id, req.body.currentEpisode);
  res.status(200).json({ success: true, data: result });
});