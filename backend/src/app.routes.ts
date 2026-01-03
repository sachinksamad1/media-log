import { Router } from "express";
import animeRoutes from "./modules/anime/anime-routes.js";
import lightNovelRoutes from "./modules/light-novel/light-novel.routes.js";

const router = Router();

// Anime Routes
router.use("/anime", animeRoutes);

// Light Novel Routes
router.use("/light-novel", lightNovelRoutes);

export default router;
