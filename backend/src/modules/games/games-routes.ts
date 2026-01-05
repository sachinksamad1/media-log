import { Router } from "express";
import { GamesController } from "./games-controller.js";
import { createGamesValidator, updateGamesValidator } from "./games-validator.js";
import { validate } from "../../common/validators/validate-request.js";

const router = Router();
const controller = new GamesController();

router
  .route("/")
  .post((req, res, next) => validate(createGamesValidator)(req, res, next), controller.create)
  .get(controller.getAll);

router
  .route("/:id")
  .get(controller.getById) // Get specific
  .patch((req, res, next) => validate(updateGamesValidator)(req, res, next), controller.update) // Update specific
  .delete((req, res, next) => validate(updateGamesValidator)(req, res, next), controller.delete); // Delete specific

export default router;
