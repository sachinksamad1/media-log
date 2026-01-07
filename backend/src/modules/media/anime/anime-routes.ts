import { Router } from "express";
import { AnimeController } from "./anime-controller.js";
import {
  createAnimeValidator,
  updateAnimeValidator,
  animeIdValidator,
} from "./anime-validator.js";
import { validate } from "../../../common/validators/validate-request.js";

const router = Router();
const controller = new AnimeController();

router
  .route("/")
  .post(
    (req, res, next) => validate(createAnimeValidator)(req, res, next),
    controller.create
  )
  .get(controller.getAll);

router
  .route("/:id")
  .get(
    (req, res, next) => validate(animeIdValidator)(req, res, next),
    controller.getById
  ) // Get specific
  .patch(
    (req, res, next) => validate(updateAnimeValidator)(req, res, next),
    controller.update
  ) // Update specific
  .delete(
    (req, res, next) => validate(animeIdValidator)(req, res, next),
    controller.delete
  ); // Delete specific

export default router;
