import { Router } from "express";
import { FictionController } from "./fiction-controller.js";
import { createFictionValidator, updateFictionValidator, fictionIdValidator } from "./fiction-validator.js";
import { validate } from "../../../common/validators/validate-request.js";

const router = Router();
const controller = new FictionController();

router
  .route("/")
  .post(
    (req, res, next) => validate(createFictionValidator)(req, res, next),
    controller.create
  )
  .get(controller.getAll);

router
  .route("/:id")
  .get(
    (req, res, next) => validate(fictionIdValidator)(req, res, next),
    controller.getById
  ) // Get specific
  .patch(
    (req, res, next) => validate(updateFictionValidator)(req, res, next),
    controller.update
  ) // Update specific
  .delete(
    (req, res, next) => validate(fictionIdValidator)(req, res, next),
    controller.delete
  ); // Delete specific

export default router;
