import { Router } from "express";
import { AnimeController } from "./anime-controller.js";
import { validate } from "../../common/validators/validate-request.js";
import {
  createAnimeValidator,
  updateAnimeValidator,
} from "./anime-validator.js";

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
  .patch(controller.update) // Update specific
  .delete(controller.delete); // Delete specific

export default router;
