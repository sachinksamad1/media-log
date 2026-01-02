import { Request, Response } from "express";
import { LightNovelService } from "./light-novel.service.js";

export class LightNovelController {
  constructor(private lightNovelService: LightNovelService) {}

  create = async (req: Request, res: Response) => {
    const lightNovel = await this.lightNovelService.addLightNovel(req.body);
    res.status(201).json({ success: true, data: lightNovel });
  };

  getAll = async (_req: Request, res: Response) => {
    const lightNovelList = await this.lightNovelService.getAllLightNovel();
    res.status(200).json({ success: true, data: lightNovelList });
  };

  getOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Validation error: ID required" });
    }
    const lightNovel = await this.lightNovelService.getLightNovelById(id);
    if (!lightNovel) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ success: true, data: lightNovel });
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });
    }

    // The service handles the merge logic
    const updatedLightNovel = await this.lightNovelService.updateLightNovel(id, req.body);

    if (!updatedLightNovel) {
      return res
        .status(404)
        .json({ success: false, message: "Light Novel not found" });
    }

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: updatedLightNovel,
    });
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });
    }

    const isDeleted = await this.lightNovelService.removeLightNovel(id);

    if (!isDeleted) {
      return res
        .status(404)
        .json({ success: false, message: "Light Novel not found" });
    }

    res.status(200).json({
      success: true,
      message: "Light Novel deleted successfully",
    });
  };
}
