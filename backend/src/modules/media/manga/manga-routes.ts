import { Router } from "express";
import { MangaController } from "./manga-controller.js";
import {
  createMangaValidator,
  updateMangaValidator,
  mangaIdValidator,
} from "./manga-validator.js";
import { validate } from "../../../common/validators/validate-request.js";

const router = Router();
const controller = new MangaController();

router
  .route("/")
  .post(
    (req, res, next) => validate(createMangaValidator)(req, res, next),
    controller.create
  )
  .get(controller.getAll);

router
  .route("/:id")
  .get(
    (req, res, next) => validate(mangaIdValidator)(req, res, next),
    controller.getById
  ) // Get specific
  .patch(
    (req, res, next) => validate(updateMangaValidator)(req, res, next),
    controller.update
  ) // Update specific
  .delete(
    (req, res, next) => validate(mangaIdValidator)(req, res, next),
    controller.delete
  ); // Delete specific

export default router;
