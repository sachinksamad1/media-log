import { Request, Response } from "express";
import { FictionService } from "./fiction.service.js";

export class FictionController {
  constructor(private fictionService: FictionService) {}

  create = async (req: Request, res: Response) => {
    const fiction = await this.fictionService.addFiction(req.body);
    res.status(201).json({ success: true, data: fiction });
  };

  getAll = async (_req: Request, res: Response) => {
    const fictionList = await this.fictionService.getAllFiction();
    res.status(200).json({ success: true, data: fictionList });
  };

  getOne = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Validation error: ID required" });
    }
    const fiction = await this.fictionService.getFictionById(id);
    if (!fiction) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ success: true, data: fiction });
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });
    }

    // The service handles the merge logic
    const updatedFiction = await this.fictionService.updateFiction(id, req.body);

    if (!updatedFiction) {
      return res
        .status(404)
        .json({ success: false, message: "Fiction not found" });
    }

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: updatedFiction,
    });
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });
    }

    const isDeleted = await this.fictionService.removeFiction(id);

    if (!isDeleted) {
      return res
        .status(404)
        .json({ success: false, message: "Fiction not found" });
    }

    res.status(200).json({
      success: true,
      message: "Fiction deleted successfully",
    });
  };
}
