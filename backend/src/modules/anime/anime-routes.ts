import { Router } from "express";
import { AnimeController } from "./anime-controller.js";
import {
  createAnimeValidator,
  updateAnimeValidator,
} from "./anime-validator.js";
import { validate } from "../../common/validators/validate-request.js";

const router = Router();
const controller = new AnimeController();

router
  .route("/")
  .get(controller.getAll)
  .post(validate(createAnimeValidator), controller.create);

router.route("/:id/complete").patch(controller.complete);

router
  .route("/:id")
  .get(controller.getById) // Get specific
  .patch(validate(updateAnimeValidator), controller.update) // Update specific
  .delete((req, res, next) => validate(updateAnimeValidator)(req, res, next),controller.delete); // Delete specific

export default router;
