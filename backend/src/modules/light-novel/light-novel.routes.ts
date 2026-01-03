import { Router } from "express";
import { LightNovelController } from "./light-novel.controller.js";
import { LightNovelService } from "./light-novel.service.js";
import { LightNovelRepository } from "./light-novel.repo.js";
import { validate } from "../../common/validators/validate-request.js";
import { LightNovelSchema } from "./light-novel.schema.js";

const router = Router();
const lightNovelRepo = new LightNovelRepository();
const lightNovelService = new LightNovelService(lightNovelRepo);
const lightNovelController = new LightNovelController(lightNovelService);

router.post("/", validate(LightNovelSchema), lightNovelController.create);
router.get("/", lightNovelController.getAll);
router.get("/:id", lightNovelController.getOne);

export default router;
