import { Router } from "express";
import { MovieController } from "./movie-controller.js";
import {
  createMovieValidator,
  updateMovieValidator,
  movieIdValidator,
} from "./movie-validator.js";
import { validate } from "../../common/validators/validate-request.js";

const router = Router();
const controller = new MovieController();

router
  .route("/")
  .post(
    (req, res, next) => validate(createMovieValidator)(req, res, next),
    controller.create
  )
  .get(controller.getAll);

router
  .route("/:id")
  .get(
    (req, res, next) => validate(movieIdValidator)(req, res, next),
    controller.getById
  ) // Get specific
  .patch(
    (req, res, next) => validate(updateMovieValidator)(req, res, next),
    controller.update
  ) // Update specific
  .delete(
    (req, res, next) => validate(movieIdValidator)(req, res, next),
    controller.delete
  ); // Delete specific

export default router;
