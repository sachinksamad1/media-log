import { Router } from "express";
import { FictionController } from "./fiction.controller.js";

const router = Router();

router.post("/", FictionController.create);
router.get("/", FictionController.getAll);

export default router;
